// Web Audio API tactical sound synthesizer

class SoundSystem {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playBeep(freq = 800, type: OscillatorType = 'sine', duration = 0.08, gainVal = 0.05) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio might be blocked by browser policy until user interacts
    }
  }

  public playRadarPing() {
    this.playBeep(980, 'sine', 0.15, 0.04);
  }

  public playWarning() {
    if (this.isMuted) return;
    this.playBeep(650, 'triangle', 0.12, 0.08);
    setTimeout(() => this.playBeep(850, 'triangle', 0.15, 0.08), 120);
  }

  public playCriticalAlert() {
    if (this.isMuted) return;
    this.playBeep(1200, 'sawtooth', 0.1, 0.1);
    setTimeout(() => this.playBeep(1500, 'sawtooth', 0.1, 0.1), 100);
    setTimeout(() => this.playBeep(1200, 'sawtooth', 0.1, 0.1), 200);
    setTimeout(() => this.playBeep(1500, 'sawtooth', 0.15, 0.1), 300);
  }

  public playClick() {
    this.playBeep(1400, 'sine', 0.03, 0.02);
  }
}

export const soundFx = new SoundSystem();
