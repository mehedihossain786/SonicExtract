import React, { useState } from 'react';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { UploadZone } from './components/UploadZone';
import { ProcessingState } from './components/ProcessingState';
import { ResultCard } from './components/ResultCard';
import { Button } from './components/Button';
import { extractAudioFromVideo, ConversionResult } from './utils/audioConverter';
import { AudioWaveform, Zap, Shield, Sparkles } from 'lucide-react';

// App Stages
enum AppStage {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.IDLE);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto start conversion? No, let user confirm or just do it?
    // UX: Usually better to let user click "Convert" if they might want to change file,
    // but for single purpose app, auto-start is snappy.
    // Let's do auto-start for "World Class" speed feeling.
    startConversion(file);
  };

  const startConversion = async (file: File) => {
    try {
      setStage(AppStage.PROCESSING);
      setProgress(0);
      setErrorMessage(null);

      const res = await extractAudioFromVideo(file, (p) => {
        setProgress(p);
      });

      setResult(res);
      setStage(AppStage.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setStage(AppStage.ERROR);
    }
  };

  const handleReset = () => {
    setStage(AppStage.IDLE);
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
    setErrorMessage(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <BackgroundBlobs />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Header Branding */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface/80 border border-neon/20 mb-4 shadow-[0_0_30px_rgba(124,255,217,0.15)] backdrop-blur-md">
            <AudioWaveform size={32} className="text-neon" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-2">
            SonicExtract
          </h1>
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase opacity-80">
            Professional Video to Audio Converter
          </p>
        </div>

        {/* Card Component */}
        <div className="bg-[#12121a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 transition-all duration-500">
          
          {stage === AppStage.IDLE && (
            <div className="animate-in fade-in zoom-in duration-300">
              <UploadZone onFileSelect={handleFileSelect} />
              
              <div className="mt-8 grid grid-cols-3 gap-2">
                <FeatureItem icon={<Zap size={16} />} label="Fast" />
                <FeatureItem icon={<Shield size={16} />} label="Secure" />
                <FeatureItem icon={<Sparkles size={16} />} label="Free" />
              </div>
            </div>
          )}

          {stage === AppStage.PROCESSING && selectedFile && (
            <div className="animate-in fade-in zoom-in duration-300">
              <ProcessingState progress={progress} fileName={selectedFile.name} />
            </div>
          )}

          {stage === AppStage.COMPLETE && result && selectedFile && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultCard 
                audioUrl={result.url} 
                fileName={selectedFile.name.replace(/\.[^/.]+$/, "")}
                format={result.format.toUpperCase()}
                onReset={handleReset}
              />
            </div>
          )}

          {stage === AppStage.ERROR && (
            <div className="text-center animate-in shake duration-300">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Conversion Failed</h3>
              <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
              <Button onClick={handleReset} variant="secondary" fullWidth>
                Try Again
              </Button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            Processed locally in your browser. No data leaves your device.
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-xs gap-2">
    {icon}
    <span>{label}</span>
  </div>
);

export default App;