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
import { cn } from '@/lib/utils'; // Import cn for conditional classNames

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [dragOffset, setDragOffset] = useState(0); // Offset from mouse to handle position
  const audioStartTimeRef = useRef<number>(0); // When the audio started playing
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
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
          setCropStart(0); // Default crop start to 0
          setFadeInDuration(1);
          setFadeOutDuration(1);
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
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }
  }, [isOpen, audioFile, onClose]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw background for the entire duration
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    const channelData = audioBuffer.getChannelData(0); // Use first channel
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = '#00F0FF'; // Theme cyan
    ctx.lineWidth = 1;

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.lineTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();

    // Draw crop region highlight
    const startPx = (cropStart / duration) * width;
    const endPx = (cropEnd / duration) * width;

    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)'; // Semi-transparent cyan
    ctx.fillRect(startPx, 0, endPx - startPx, height);

    // Draw crop handles
    ctx.fillStyle = '#00F0FF'; // Theme cyan
    ctx.fillRect(startPx - 2, 0, 4, height); // Start handle
    ctx.fillRect(endPx - 2, 0, 4, height);   // End handle

    // Draw playback head
    if (sourceNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      const elapsedSinceStart = currentTime - audioStartTimeRef.current;
      const playbackTime = cropStart + elapsedSinceStart; // Adjust for cropped start

      if (playbackTime >= cropStart && playbackTime <= cropEnd) {
        const playbackPx = ((playbackTime - cropStart) / (cropEnd - cropStart)) * (endPx - startPx) + startPx;
        ctx.strokeStyle = '#FF0000'; // Red for playback head
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playbackPx, 0);
        ctx.lineTo(playbackPx, height);
        ctx.stroke();
      }
    }
  }, [audioBuffer, cropStart, cropEnd, duration]);

  // Animation loop for playback head
  const animatePlayback = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      drawWaveform(); // Redraw with updated playback head
      animationFrameIdRef.current = requestAnimationFrame(animatePlayback);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      drawWaveform(); // Final redraw to clear playback head
    }
  }, [drawWaveform]);

  // Effect to draw waveform when audioBuffer or crop changes
  useEffect(() => {
    drawWaveform();
  }, [audioBuffer, cropStart, cropEnd, drawWaveform]);

  // Canvas interaction handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBuffer) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = canvas.width;

    const startPx = (cropStart / duration) * width;
    const endPx = (cropEnd / duration) * width;

    const handleWidth = 10; // clickable area around handle

    if (mouseX >= startPx - handleWidth && mouseX <= startPx + handleWidth) {
      setIsDraggingStart(true);
      setDragOffset(mouseX - startPx);
    } else if (mouseX >= endPx - handleWidth && mouseX <= endPx + handleWidth) {
      setIsDraggingEnd(true);
      setDragOffset(mouseX - endPx);
    }
  }, [audioBuffer, cropStart, cropEnd, duration]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || (!isDraggingStart && !isDraggingEnd)) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = canvas.width;

    const newPx = mouseX - dragOffset;
    const newTime = (newPx / width) * duration;

    if (isDraggingStart) {
      setCropStart(Math.max(0, Math.min(newTime, cropEnd - 0.1))); // Ensure start < end
    } else if (isDraggingEnd) {
      setCropEnd(Math.min(duration, Math.max(newTime, cropStart + 0.1))); // Ensure end > start
    }
  }, [isDraggingStart, isDraggingEnd, dragOffset, cropStart, cropEnd, duration]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  }, []);

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
        const gain = j / fadeInSamples; // Linear fade from 0 to 1
        channelData[j] *= gain;
      }

      // Fade Out
      if (fadeOutSamples > 0) {
        for (let j = 0; j < fadeOutSamples; j++) {
          const sampleIndex = newBuffer.length - fadeOutSamples + j;
          if (sampleIndex >= 0 && sampleIndex < newBuffer.length) {
            // Linear fade from 1 to 0
            const gain = (fadeOutSamples - 1 - j) / (fadeOutSamples > 1 ? fadeOutSamples - 1 : 1); 
            channelData[sampleIndex] *= gain;
          }
        }
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
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    }

    try {
      const processedBuffer = applyEffects(audioBuffer, cropStart, cropEnd, fadeInDuration, fadeOutDuration);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = processedBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0); // Play from the beginning of the processed buffer
      sourceNodeRef.current = source;
      audioStartTimeRef.current = audioContextRef.current.currentTime; // Record start time

      source.onended = () => {
        sourceNodeRef.current = null;
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
        drawWaveform(); // Redraw to clear playback head
      };

      // Start playback animation
      animationFrameIdRef.current = requestAnimationFrame(animatePlayback);

    } catch (error) {
      console.error("Error during preview:", error);
      showError("Erreur lors de la prévisualisation de l'audio.");
    }
  }, [audioBuffer, cropStart, cropEnd, fadeInDuration, fadeOutDuration, applyEffects, animatePlayback, drawWaveform]);

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
    view.setUint32(12, 0x20746d66, true); // format chunk identifier ('fmt ')
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
        <DialogHeader className={cn("animate-fade-in-slide-up")} style={{ animationDelay: '0.1s' }}>
          <DialogTitle>Éditer l'Audio</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ajustez les effets de fondu et découpez votre fichier audio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {audioFile && (
            <p className={cn("text-sm text-gray-300 animate-fade-in-slide-up")} style={{ animationDelay: '0.2s' }}>Fichier: {audioFile.name}</p>
          )}
          {duration > 0 && (
            <p className={cn("text-sm text-gray-300 animate-fade-in-slide-up")} style={{ animationDelay: '0.3s' }}>Durée originale: {duration.toFixed(2)}s</p>
          )}

          <div className={cn("grid gap-2 animate-fade-in-slide-up")} style={{ animationDelay: '0.4s' }}>
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

          <div className="grid gap-2 animate-fade-in-slide-up" style={{ animationDelay: '0.5s' }}>
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

          <div className="grid gap-2 animate-fade-in-slide-up" style={{ animationDelay: '0.6s' }}>
            <Label>Découpe Audio (Crop)</Label>
            <div className="relative w-full h-32 bg-gray-800 rounded-md overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500} // Fixed width for drawing, will be scaled by CSS
                height={128} // Fixed height
                className="w-full h-full cursor-ew-resize"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp} // Stop dragging if mouse leaves canvas
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{cropStart.toFixed(2)}s</span>
              <span>{cropEnd.toFixed(2)}s</span>
            </div>
          </div>
        </div>
        <DialogFooter className={cn("animate-fade-in-slide-up")} style={{ animationDelay: '0.7s' }}>
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