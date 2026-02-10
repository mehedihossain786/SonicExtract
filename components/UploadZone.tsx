import React, { useRef, useState } from 'react';
import { Upload, FileVideo, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSelect = (file: File) => {
    setError(null);
    if (file.type.startsWith('video/')) {
      onFileSelect(file);
    } else {
      setError('Please select a valid video file (MP4, WebM, MOV, etc.)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10
          transition-all duration-300
          flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-neon bg-neon/5 scale-[1.02]' 
            : 'border-gray-700 hover:border-neon/50 hover:bg-white/5'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleInputChange}
        />
        
        <div className={`
          mb-4 p-4 rounded-full bg-surface
          transition-all duration-300
          ${isDragging ? 'text-neon shadow-[0_0_20px_rgba(124,255,217,0.3)]' : 'text-gray-400 group-hover:text-neon group-hover:scale-110'}
        `}>
          {isDragging ? <FileVideo size={40} /> : <Upload size={40} />}
        </div>

        <h3 className="text-lg font-bold mb-2 text-white">
          {isDragging ? 'Drop video here' : 'Upload Video'}
        </h3>
        <p className="text-sm text-gray-400 max-w-[200px]">
          Drag & drop or click to browse files
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-pulse">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};