class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private trainGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private trainChugInterval: number | null = null;
  private tensionOscillator: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  // UI Click
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Mechanical switch lever clank
  public playLeverClank() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Heavy low thud
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);

    // High metal clink
    const oscHigh = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    oscHigh.type = 'square';
    oscHigh.frequency.setValueAtTime(1400, now);
    oscHigh.frequency.exponentialRampToValueAtTime(900, now + 0.12);
    highGain.gain.setValueAtTime(0.25, now);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    oscHigh.connect(highGain);
    highGain.connect(this.masterGain);
    oscHigh.start(now);
    oscHigh.stop(now + 0.15);

    // Metallic latch rattle
    this.playNoise(0.08, 0.3, 1800);
  }

  // Emergency brake air hiss & metal screech
  public playEmergencyBrake() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Air release hiss (white noise filtered)
    this.playNoise(1.5, 0.4, 2400);

    // Wheel screech
    const screech = this.ctx.createOscillator();
    const screechGain = this.ctx.createGain();
    screech.type = 'sawtooth';
    screech.frequency.setValueAtTime(1800, now + 0.2);
    screech.frequency.linearRampToValueAtTime(1200, now + 1.2);
    screechGain.gain.setValueAtTime(0.01, now);
    screechGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    screechGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    screech.connect(screechGain);
    screechGain.connect(this.masterGain);
    screech.start(now + 0.2);
    screech.stop(now + 1.6);
  }

  // Train horn / diesel blast
  public playTrainHorn() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const frequencies = [311.13, 370.0, 466.16]; // Eb chord (classic train horn triad)

    frequencies.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.setValueAtTime(0.18, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 2.1);
    });
  }

  // Radio squelch / static chirp
  public playRadioChirp() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    this.playNoise(0.18, 0.2, 3500);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now + 0.05);
    osc.frequency.setValueAtTime(1500, now + 0.1);

    gain.gain.setValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now + 0.05);
    osc.stop(now + 0.18);
  }

  // Tension timer tick
  public playTimerTick(urgent: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(urgent ? 880 : 540, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    gain.gain.setValueAtTime(urgent ? 0.3 : 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Deep reflection intro chord
  public playReflectionTone() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const freqs = [110, 164.81, 220, 277.18]; // A minor chord

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  }

  // Continuous train track rumble/clatter
  public startTrainRumble() {
    this.stopTrainRumble();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.trainGain = this.ctx.createGain();
    this.trainGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.trainGain.connect(this.masterGain);

    let step = 0;
    this.trainChugInterval = window.setInterval(() => {
      if (!this.ctx || !this.trainGain || this.isMuted) return;
      const now = this.ctx.currentTime;

      // Clack-clack rhythm
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(step % 2 === 0 ? 80 : 65, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(g);
      g.connect(this.trainGain);

      osc.start(now);
      osc.stop(now + 0.1);
      step++;
    }, 280);
  }

  public stopTrainRumble() {
    if (this.trainChugInterval !== null) {
      clearInterval(this.trainChugInterval);
      this.trainChugInterval = null;
    }
    if (this.trainGain && this.ctx) {
      this.trainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      setTimeout(() => {
        try {
          this.trainGain?.disconnect();
        } catch (_) {}
        this.trainGain = null;
      }, 350);
    }
  }

  // Ambient wind drone
  public startAmbientWind() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.ambientGain) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    noise.start();
  }

  private playNoise(duration: number, volume: number, cutoff: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    source.start(this.ctx.currentTime);
  }
}

export const sound = new SoundSystem();
