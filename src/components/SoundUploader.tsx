import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { showError } from "@/utils/toast";

interface SoundUploaderProps {
  label: string;
  selectedFileName: string | null; // Now directly reflects the name from context
  onFileSelect: (file: File | null) => void; // Can now accept null to clear
}

export const SoundUploader = ({ label, selectedFileName, onFileSelect }: SoundUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        onFileSelect(file);
      } else {
        showError("Veuillez sélectionner un fichier audio valide.");
      }
    }
    // Reset the input value to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the input visually
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-400">
          {selectedFileName || "Aucun son sélectionné"}
        </p>
      </div>
      <div className="flex space-x-2">
        {selectedFileName && (
          <Button variant="outline" onClick={handleClearFile} className="text-red-400 border-red-400 hover:bg-red-400/10">
            Supprimer
          </Button>
        )}
        <Button onClick={handleButtonClick}>Choisir un fichier</Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
    </div>
  );
};