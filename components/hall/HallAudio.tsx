"use client";

import { useEffect, useRef } from 'react';

// Generative Audio Engine for the Hall of Ascension
export function HallAudio({ stage }: { stage: number }) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Nodes
  const masterGainRef = useRef<GainNode | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const synthOscRef = useRef<OscillatorNode | null>(null);
  const bassOscRef = useRef<OscillatorNode | null>(null);
  const shimmerOscRef = useRef<OscillatorNode | null>(null);

  const humGainRef = useRef<GainNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const bassGainRef = useRef<GainNode | null>(null);
  const shimmerGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API on first mount
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // 1. Low Architectural Hum (Decision Room)
      const hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 55; // Low A
      const humGain = ctx.createGain();
      humGain.gain.value = 0;
      hum.connect(humGain).connect(master);
      hum.start();
      humOscRef.current = hum;
      humGainRef.current = humGain;

      // 2. Soft AI Synth (Mind Room)
      const synth = ctx.createOscillator();
      synth.type = 'triangle';
      synth.frequency.value = 220; // A3
      const synthFilter = ctx.createBiquadFilter();
      synthFilter.type = 'lowpass';
      synthFilter.frequency.value = 400;
      const synthGain = ctx.createGain();
      synthGain.gain.value = 0;
      synth.connect(synthFilter).connect(synthGain).connect(master);
      synth.start();
      synthOscRef.current = synth;
      synthGainRef.current = synthGain;

      // 3. Deep Bass (Discipline Room)
      const bass = ctx.createOscillator();
      bass.type = 'sine';
      bass.frequency.value = 32.7; // C1
      const bassGain = ctx.createGain();
      bassGain.gain.value = 0;
      bass.connect(bassGain).connect(master);
      bass.start();
      bassOscRef.current = bass;
      bassGainRef.current = bassGain;

      // 4. Shimmer (Portal)
      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 880; // A5
      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0;
      shimmer.connect(shimmerGain).connect(master);
      shimmer.start();
      shimmerOscRef.current = shimmer;
      shimmerGainRef.current = shimmerGain;
    }

    return () => {
      // Cleanup on unmount
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Stage Transitions
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    // Ensure context is running (might be suspended by browser policy until interaction)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(e => console.warn('Audio Context resume failed', e));
    }

    const hG = humGainRef.current?.gain;
    const sG = synthGainRef.current?.gain;
    const bG = bassGainRef.current?.gain;
    const shG = shimmerGainRef.current?.gain;

    const t = ctx.currentTime;
    const rampTime = 2.0; // 2 seconds crossfade

    // Reset all to 0
    if (hG) hG.linearRampToValueAtTime(0, t + rampTime);
    if (sG) sG.linearRampToValueAtTime(0, t + rampTime);
    if (bG) bG.linearRampToValueAtTime(0, t + rampTime);
    if (shG) shG.linearRampToValueAtTime(0, t + rampTime);

    // Apply specific room atmosphere
    if (stage === 1) { // Decision
      if (hG) hG.linearRampToValueAtTime(0.3, t + rampTime);
    } else if (stage === 2) { // Mind
      if (sG) sG.linearRampToValueAtTime(0.15, t + rampTime);
    } else if (stage === 3) { // Discipline
      if (bG) bG.linearRampToValueAtTime(0.4, t + rampTime);
    } else if (stage === 4) { // Future
      // Almost silence
    } else if (stage >= 5) { // Portal
      if (shG) shG.linearRampToValueAtTime(0.1, t + rampTime);
    }
  }, [stage]);

  return null;
}
