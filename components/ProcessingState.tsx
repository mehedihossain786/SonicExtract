import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  progress: number;
  fileName: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ progress, fileName }) => {
  return (
    <div className="w-full py-8 flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-neon blur-xl opacity-20 animate-pulse"></div>
        <Loader2 size={48} className="text-neon animate-spin relative z-10" />
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-white">Extracting Audio</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-[250px] truncate">
        {fileName}
      </p>

      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-neon transition-all duration-300 ease-out shadow-[0_0_10px_rgba(124,255,217,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between w-full text-xs text-gray-500 font-mono">
        <span>PROCESSING</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};