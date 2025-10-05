import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { showError } from "@/utils/toast";

interface SoundUploaderProps {
  label: string;
  selectedFileName: string | null;
  onFileSelect: (file: File) => void;
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
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-400">
          {selectedFileName || "Aucun son sélectionné"}
        </p>
      </div>
      <Button onClick={handleButtonClick}>Choisir un fichier</Button>
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