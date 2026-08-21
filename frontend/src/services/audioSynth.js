// Web Audio API Audio Synthesizer for FocusFlow
// Provides tactile sound FX (clicks, chimes, fanfares) and procedural ambient soundscapes.

class AudioSynth {
  constructor() {
    this.ctx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.activeAmbientType = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Ignore audio context autoplay limitations gracefully
    }
  }

  playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.45);
      });
    } catch {
      // Ignore audio error
    }
  }

  playLevelUpFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + i * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.65);
      });
    } catch {
      // Ignore audio error
    }
  }

  playTimerBell() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    } catch {
      // Ignore audio error
    }
  }

  startAmbientSound(type, volume = 0.3) {
    this.stopAmbientSound();
    this.initContext();
    if (!this.ctx) return;

    this.activeAmbientType = type;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    if (type === 'rain') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
    } else if (type === 'ocean') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Wave swell frequency
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
    } else if (type === 'binaural') {
      // 40Hz Gamma binaural beats
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);

      oscL.frequency.setValueAtTime(200, this.ctx.currentTime);
      oscR.frequency.setValueAtTime(240, this.ctx.currentTime);

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);

      merger.connect(this.ambientGain);
      oscL.start();
      oscR.start();
      this.ambientSource = [oscL, oscR];
      this.ambientGain.connect(this.ctx.destination);
      return;
    } else {
      // Default White / Pink noise
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
    }

    this.ambientSource = whiteNoise;
    whiteNoise.start();
    this.ambientGain.connect(this.ctx.destination);
  }

  stopAmbientSound() {
    if (this.ambientSource) {
      if (Array.isArray(this.ambientSource)) {
        this.ambientSource.forEach(s => {
          try { s.stop(); } catch {}
        });
      } else {
        try { this.ambientSource.stop(); } catch {}
      }
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch {}
      this.ambientGain = null;
    }
    this.activeAmbientType = null;
  }

  setVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }
}

export const audioSynth = new AudioSynth();
