import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw, Music } from 'lucide-react';
import { Button } from './Button';

interface ResultCardProps {
  audioUrl: string;
  fileName: string;
  format: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ audioUrl, fileName, format, onReset }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="w-full animate-pop">
      <div className="bg-surface/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center text-neon">
            <Music size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{fileName}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{format} Audio</p>
          </div>
        </div>

        {/* Custom Audio Player Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-neon [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(124,255,217,0.5)] hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
          />

          <div className="flex justify-center mt-2">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
            </button>
          </div>
        </div>
        
        <audio ref={audioRef} src={audioUrl} className="hidden" />
      </div>

      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          onClick={onReset}
          className="flex-1"
        >
          <RotateCcw size={18} />
          <span>New</span>
        </Button>
        
        <a 
          href={audioUrl} 
          download={`extracted-audio-${Date.now()}.${format}`}
          className="flex-[2] block"
        >
          <Button fullWidth className="h-full">
            <Download size={18} />
            <span>Download Audio</span>
          </Button>
        </a>
      </div>
    </div>
  );
};