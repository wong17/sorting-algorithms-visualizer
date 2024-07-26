export class AudioUtil {

  private static audioContext: AudioContext | null = null;

  /**
   * Crea el contexto de audio si aún no se ha creado.
   */
  static createAudioContext() {
    if (!this.audioContext)
      this.audioContext = new AudioContext();
  }

  static suspendAudioContext() {
    if (this.audioContext && this.audioContext.state !== 'suspended')
      this.audioContext.suspend()
  }

  /**
   * Necesario para verificar si el usuario realizó un gesto en la web para poder
   * reproducir sonido 
   * https://developer.chrome.com/blog/autoplay/#webaudio
   * @returns true si se ha creado el audio context, false caso contrario
   */
  static isAudioContextCreated(): boolean {
    return !!this.audioContext;
  }

  /**
   * Reproduce un sonido con una interpolación de frecuencia.
   * @param startFreq - Frecuencia inicial en Hertz.
   * @param endFreq - Frecuencia final en Hertz.
   * @param duration - Duración del sonido en segundos (por defecto es 0.1 segundos).
   * @param volume - Volumen del sonido (por defecto es 0.1).
   */
  static playInterpolatedSound(startFreq: number, endFreq: number, duration: number = 0.1, volume: number = 0.1) {
    if (!this.audioContext || this.audioContext.state !== 'running')
      return;
    // Crear un oscilador, que es un generador de ondas sonoras.
    const oscillator = this.audioContext.createOscillator();
    // Crear un nodo de ganancia para controlar el volumen.
    const gainNode = this.audioContext.createGain();
    // Conectar el oscilador al nodo de ganancia y este al destino del contexto de audio (los altavoces).
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    // Configurar el tipo de onda del oscilador (sine, square, sawtooth, triangle).
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);

    // Interpolar entre las frecuencias durante la duración especificada.
    oscillator.frequency.linearRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime); // Volume control
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    // Iniciar el oscilador en el tiempo actual.
    oscillator.start(this.audioContext.currentTime);
    // Detener el oscilador después de la duración especificada.
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
