import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" />
    </div>
  );
};