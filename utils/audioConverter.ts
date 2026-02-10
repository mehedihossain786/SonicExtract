export interface ConversionResult {
  blob: Blob;
  url: string;
  format: string;
}

export const extractAudioFromVideo = (
  videoFile: File,
  onProgress: (progress: number) => void
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    // 1. Validate File
    if (!videoFile.type.startsWith('video/')) {
      return reject(new Error('Invalid file type. Please upload a video.'));
    }

    // 2. Setup Video Element
    const video = document.createElement('video');
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = false; // Source must be unmuted for AudioContext to capture it
    video.playbackRate = 1.0; // Normal speed ensures best quality
    
    // 3. Setup Audio Context & Recorder
    // Using AudioContext allows us to route audio to a stream destination
    // effectively "muting" it for the user while still recording the data.
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    // Determine supported mime type
    let mimeType = 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      mimeType = 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      mimeType = 'audio/mp4';
    }

    let recorder: MediaRecorder;
    let source: MediaElementAudioSourceNode;
    let destination: MediaStreamAudioDestinationNode;
    const chunks: Blob[] = [];

    // Cleanup function to release resources
    const cleanup = () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(videoUrl);
      if (ctx.state !== 'closed') ctx.close();
      video.remove();
    };

    video.onloadedmetadata = () => {
      try {
        source = ctx.createMediaElementSource(video);
        destination = ctx.createMediaStreamDestination();
        source.connect(destination);
        // Note: We do NOT connect to ctx.destination, so it remains silent to the user.

        recorder = new MediaRecorder(destination.stream, {
          mimeType: mimeType.split(';')[0] // Some browsers prefer simple mime
        });

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
          const resultUrl = URL.createObjectURL(blob);
          cleanup();
          resolve({
            blob,
            url: resultUrl,
            format: mimeType.split('/')[1].split(';')[0]
          });
        };

        recorder.onerror = (e) => {
          cleanup();
          reject(new Error('Recorder error: ' + (e as any).error?.message));
        };

        // Start everything
        recorder.start();
        video.play().catch(e => {
          cleanup();
          reject(new Error('Playback failed: ' + e.message));
        });

      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Error loading video file.'));
    };

    // Progress tracking
    video.ontimeupdate = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        onProgress(Math.min(percent, 99.9)); // Keep <100 until fully done
      }
    };

    video.onended = () => {
      onProgress(100);
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    };
  });
};
