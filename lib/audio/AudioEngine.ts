// lib/audio/AudioEngine.ts

export type AudioCategory = 'master' | 'workout' | 'hydration' | 'meal' | 'achievement' | 'ui';

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initialized = false;
  
  // Settings
  private volumes: Record<AudioCategory, number> = {
    master: 0.8,
    workout: 1.0,
    hydration: 0.8,
    meal: 0.7,
    achievement: 1.0,
    ui: 0.5
  };
  private quietHours = false;
  private isMuted = false;

  public init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.updateMasterVolume();
      this.initialized = true;
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  public setVolume(category: AudioCategory, level: number) {
    this.volumes[category] = level;
    if (category === 'master') this.updateMasterVolume();
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    this.updateMasterVolume();
  }

  public setQuietHours(active: boolean) {
    this.quietHours = active;
    this.updateMasterVolume();
  }

  private updateMasterVolume() {
    if (!this.masterGain || !this.ctx) return;
    
    // Cross-fade / smooth transition
    const targetVolume = this.isMuted || this.quietHours ? 0 : this.volumes.master;
    this.masterGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.1);
  }

  // --- Profiles ---

  public playSunriseChime() {
    this.playToneSequence([
      { freq: 523.25, time: 0, dur: 1.5, type: 'sine', pan: -0.5 },
      { freq: 659.25, time: 0.2, dur: 1.5, type: 'sine', pan: 0.5 },
      { freq: 783.99, time: 0.4, dur: 2.0, type: 'sine', pan: 0 }
    ], this.volumes.ui);
  }

  public playEnergeticPulse() {
    this.playToneSequence([
      { freq: 220, time: 0, dur: 0.1, type: 'square', pan: -0.2 },
      { freq: 220, time: 0.15, dur: 0.1, type: 'square', pan: 0.2 },
      { freq: 440, time: 0.3, dur: 0.3, type: 'square', pan: 0 }
    ], this.volumes.workout);
  }

  public playWaterDrop() {
    this.playToneSequence([
      { freq: 800, time: 0, dur: 0.05, type: 'sine', pan: 0.3 },
      { freq: 1200, time: 0.05, dur: 0.1, type: 'sine', pan: -0.3 }
    ], this.volumes.hydration);
  }

  public playSoftNotification() {
    this.playToneSequence([
      { freq: 600, time: 0, dur: 0.2, type: 'triangle', pan: -0.1 },
      { freq: 800, time: 0.1, dur: 0.3, type: 'triangle', pan: 0.1 }
    ], this.volumes.meal);
  }

  public playVictoryBurst() {
    this.playToneSequence([
      { freq: 440, time: 0, dur: 0.1, type: 'sine', pan: -0.8 },
      { freq: 554.37, time: 0.1, dur: 0.1, type: 'sine', pan: 0.8 },
      { freq: 659.25, time: 0.2, dur: 0.1, type: 'sine', pan: -0.4 },
      { freq: 880, time: 0.3, dur: 0.8, type: 'sine', pan: 0 }
    ], this.volumes.achievement);
  }

  public playEnergyPulse() {
    this.playToneSequence([
      { freq: 300, time: 0, dur: 0.4, type: 'sawtooth', pan: 0 },
      { freq: 600, time: 0.2, dur: 0.6, type: 'sine', pan: 0 }
    ], this.volumes.achievement);
  }

  public playAttentionTone() {
    this.playToneSequence([
      { freq: 800, time: 0, dur: 0.2, type: 'sine', pan: -0.2 },
      { freq: 750, time: 0.3, dur: 0.4, type: 'sine', pan: 0.2 }
    ], this.volumes.ui);
  }
  
  public playHapticPop() {
    this.playToneSequence([
      { freq: 150, time: 0, dur: 0.05, type: 'triangle', pan: 0 },
      { freq: 300, time: 0.02, dur: 0.03, type: 'triangle', pan: 0 }
    ], this.volumes.ui * 0.5);
  }

  // --- Internal Synth Engine ---

  private playToneSequence(notes: {freq: number, time: number, dur: number, type: OscillatorType, pan?: number}[], volumeMultiplier: number) {
    if (!this.ctx || !this.masterGain || this.isMuted || this.quietHours) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    
    notes.forEach(note => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, t + note.time);
      
      gain.gain.setValueAtTime(0, t + note.time);
      gain.gain.linearRampToValueAtTime(0.5 * volumeMultiplier, t + note.time + 0.05); // Fade in
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.time + note.dur); // Fade out
      
      osc.connect(gain);
      
      // Add spatial panning if supported
      if (typeof StereoPannerNode !== 'undefined') {
        const panner = this.ctx!.createStereoPanner();
        panner.pan.value = note.pan || 0;
        gain.connect(panner);
        panner.connect(this.masterGain!);
      } else {
        gain.connect(this.masterGain!);
      }
      
      osc.start(t + note.time);
      osc.stop(t + note.time + note.dur + 0.1);
    });
  }
}

export const AudioEngine = new AudioEngineClass();
