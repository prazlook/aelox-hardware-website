import { showError } from "@/utils/toast";

const DB_NAME = "DyadAudioDB";
const STORE_NAME = "audioFiles";
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("IndexedDB error:", error);
      showError("Erreur lors de l'ouverture de la base de données audio.");
      reject(error);
    };
  });
}

export async function addAudioFile(file: File): Promise<string> {
  const database = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ name: file.name, data: file });

    request.onsuccess = () => resolve(file.name);
    request.onerror = (event) => {
      const error = (event.target as IDBRequest).error;
      console.error("Error adding audio file:", error);
      showError(`Erreur lors de l'ajout du fichier audio : ${file.name}`);
      reject(error);
    };
  });
}

export async function getAudioFile(fileName: string): Promise<File | null> {
  const database = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileName);

    request.onsuccess = () => {
      const result = request.result;
      if (result && result.data instanceof Blob) {
        // Recreate File object from Blob
        resolve(new File([result.data], result.name, { type: result.data.type }));
      } else {
        resolve(null);
      }
    };
    request.onerror = (event) => {
      const error = (event.target as IDBRequest).error;
      console.error("Error getting audio file:", error);
      showError(`Erreur lors de la récupération du fichier audio : ${fileName}`);
      reject(error);
    };
  });
}

export async function deleteAudioFile(fileName: string): Promise<void> {
  const database = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(fileName);

    request.onsuccess = () => resolve();
    request.onerror = (event) => {
      const error = (event.target as IDBRequest).error;
      console.error("Error deleting audio file:", error);
      showError(`Erreur lors de la suppression du fichier audio : ${fileName}`);
      reject(error);
    };
  });
}