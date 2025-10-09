import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { showError, showSuccess } from "@/utils/toast";

interface AudioEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  audioFile: File | null;
  onSave: (processedFile: File) => void;
}

const AudioEditorDialog = ({ isOpen, onClose, audioFile, onSave }: AudioEditorDialogProps) => {
  const [fadeInDuration, setFadeInDuration] = useState(1); // seconds
  const [fadeOutDuration, setFadeOutDuration] = useState(1); // seconds
  const [cropStart, setCropStart] = useState(0); // seconds
  const [cropEnd, setCropEnd] = useState(0); // seconds
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState(0); // total audio duration

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Load audio file into AudioBuffer
  useEffect(() => {
    if (isOpen && audioFile && audioContextRef.current) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const buffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
          setAudioBuffer(buffer);
          setDuration(buffer.duration);
          setCropEnd(buffer.duration); // Default crop end to full duration
        } catch (error) {
          console.error("Error decoding audio data:", error);
          showError("Impossible de charger le fichier audio.");
          onClose();
        }
      };
      reader.readAsArrayBuffer(audioFile);
    } else {
      // Reset state when dialog closes or no file
      setAudioBuffer(null);
      setDuration(0);
      setCropStart(0);
      setCropEnd(0);
      setFadeInDuration(1);
      setFadeOutDuration(1);
      // Stop any playing audio
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
    }
  }, [isOpen, audioFile, onClose]);

  const applyEffects = useCallback((buffer: AudioBuffer, start: number, end: number, fadeIn: number, fadeOut: number): AudioBuffer => {
    if (!audioContextRef.current) return buffer;

    const sampleRate = buffer.sampleRate;
    const originalDuration = buffer.duration;

    // 1. Cropping
    const croppedStartTime = Math.max(0, start);
    const croppedEndTime = Math.min(originalDuration, end);
    const croppedLength = croppedEndTime - croppedStartTime;

    if (croppedLength <= 0) {
      showError("La durée de découpe est invalide.");
      return buffer; // Return original or empty buffer
    }

    const startOffsetSamples = Math.floor(croppedStartTime * sampleRate);
    const endOffsetSamples = Math.floor(croppedEndTime * sampleRate);
    const croppedBufferLengthSamples = endOffsetSamples - startOffsetSamples;

    const newBuffer = audioContextRef.current.createBuffer(
      buffer.numberOfChannels,
      croppedBufferLengthSamples,
      sampleRate
    );

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const originalChannelData = buffer.getChannelData(i);
      const newChannelData = newBuffer.getChannelData(i);
      for (let j = 0; j < croppedBufferLengthSamples; j++) {
        newChannelData[j] = originalChannelData[startOffsetSamples + j];
      }
    }

    // 2. Apply Fade In/Out
    const fadeInSamples = Math.min(Math.floor(fadeIn * sampleRate), newBuffer.length);
    const fadeOutSamples = Math.min(Math.floor(fadeOut * sampleRate), newBuffer.length);

    for (let i = 0; i < newBuffer.numberOfChannels; i++) {
      const channelData = newBuffer.getChannelData(i);

      // Fade In
      for (let j = 0; j < fadeInSamples; j++) {
        const gain = j / fadeInSamples; // Linear fade
        channelData[j] *= gain;
      }

      // Fade Out
      for (let j = 0; j < fadeOutSamples; j++) {
        const gain = (fadeOutSamples - 1 - j) / fadeOutSamples; // Linear fade
        channelData[newBuffer.length - 1 - j] *= gain;
      }
    }

    return newBuffer;
  }, []);

  const playPreview = useCallback(() => {
    if (!audioBuffer || !audioContextRef.current) {
      showError("Aucun fichier audio chargé pour la prévisualisation.");
      return;
    }

    // Stop any currently playing audio
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    try {
      const processedBuffer = applyEffects(audioBuffer, cropStart, cropEnd, fadeInDuration, fadeOutDuration);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = processedBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      sourceNodeRef.current = source;

      source.onended = () => {
        sourceNodeRef.current = null;
      };
    } catch (error) {
      console.error("Error during preview:", error);
      showError("Erreur lors de la prévisualisation de l'audio.");
    }
  }, [audioBuffer, cropStart, cropEnd, fadeInDuration, fadeOutDuration, applyEffects]);

  const handleSave = async () => {
    if (!audioFile || !audioBuffer || !audioContextRef.current) {
      showError("Aucun fichier audio à sauvegarder.");
      return;
    }

    try {
      const processedBuffer = applyEffects(audioBuffer, cropStart, cropEnd, fadeInDuration, fadeOutDuration);

      // Convert AudioBuffer to WAV Blob
      const wavBlob = await audioBufferToWavBlob(processedBuffer, audioContextRef.current.sampleRate);

      // Create a new File object
      const newFileName = `processed_${audioFile.name}`;
      const processedFile = new File([wavBlob], newFileName, { type: 'audio/wav' });

      onSave(processedFile);
      showSuccess("Fichier audio traité et sauvegardé !");
      onClose();
    } catch (error) {
      console.error("Error saving audio file:", error);
      showError("Erreur lors de la sauvegarde du fichier audio.");
    }
  };

  // Helper to convert AudioBuffer to WAV Blob
  const audioBufferToWavBlob = async (audioBuffer: AudioBuffer, sampleRate: number): Promise<Blob> => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const dataLength = length * numberOfChannels * 2; // 16-bit samples
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    // WAV header
    writeString(view, 0, 'RIFF'); // RIFF identifier
    view.setUint32(4, 36 + dataLength, true); // file length
    writeString(view, 8, 'WAVE'); // RIFF type
    writeString(view, 12, 'fmt '); // format chunk identifier
    view.setUint32(16, 16, true); // format chunk length
    view.setUint16(20, 1, true); // sample format (1 = PCM)
    view.setUint16(22, numberOfChannels, true); // number of channels
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // byte rate
    view.setUint16(32, numberOfChannels * 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, 'data'); // data chunk identifier
    view.setUint32(40, dataLength, true); // data chunk length

    // Write audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true); // 16-bit PCM
        offset += 2;
      }
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-theme-card text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Éditer l'Audio</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ajustez les effets de fondu et découpez votre fichier audio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {audioFile && (
            <p className="text-sm text-gray-300">Fichier: {audioFile.name}</p>
          )}
          {duration > 0 && (
            <p className="text-sm text-gray-300">Durée originale: {duration.toFixed(2)}s</p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="fade-in">Fondu d'entrée (Fade In)</Label>
            <Slider
              id="fade-in"
              min={0}
              max={10}
              step={0.1}
              value={[fadeInDuration]}
              onValueChange={(val) => setFadeInDuration(val[0])}
              className="w-full"
            />
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={fadeInDuration}
              onChange={(e) => setFadeInDuration(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{fadeInDuration.toFixed(1)} secondes</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fade-out">Fondu de sortie (Fade Out)</Label>
            <Slider
              id="fade-out"
              min={0}
              max={10}
              step={0.1}
              value={[fadeOutDuration]}
              onValueChange={(val) => setFadeOutDuration(val[0])}
              className="w-full"
            />
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={fadeOutDuration}
              onChange={(e) => setFadeOutDuration(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{fadeOutDuration.toFixed(1)} secondes</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="crop-start">Début de découpe (Crop Start)</Label>
            <Slider
              id="crop-start"
              min={0}
              max={duration}
              step={0.1}
              value={[cropStart]}
              onValueChange={(val) => setCropStart(val[0])}
              className="w-full"
            />
            <Input
              type="number"
              min="0"
              max={duration.toFixed(2)}
              step="0.1"
              value={cropStart}
              onChange={(e) => setCropStart(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{cropStart.toFixed(1)} secondes</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="crop-end">Fin de découpe (Crop End)</Label>
            <Slider
              id="crop-end"
              min={0}
              max={duration}
              step={0.1}
              value={[cropEnd]}
              onValueChange={(val) => setCropEnd(val[0])}
              className="w-full"
            />
            <Input
              type="number"
              min="0"
              max={duration.toFixed(2)}
              step="0.1"
              value={cropEnd}
              onChange={(e) => setCropEnd(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-400">{cropEnd.toFixed(1)} secondes</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={playPreview}>
            Prévisualiser
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AudioEditorDialog;