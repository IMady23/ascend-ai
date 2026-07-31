'use client';

import { useEffect } from 'react';
import { AudioEngine } from '@/lib/audio/AudioEngine';

export function InitAudio() {
  useEffect(() => {
    const handleInteraction = () => {
      AudioEngine.init();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return null;
}
