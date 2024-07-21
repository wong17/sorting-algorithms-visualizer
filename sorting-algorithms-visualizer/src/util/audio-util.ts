export class AudioUtil {

  // Contexto de audio, necesario para crear y manipular audio.
  private static audioContext: AudioContext = new AudioContext();

  /**
   * Reproduce un sonido con una frecuencia y duración especificadas.
   * @param frequency - La frecuencia del sonido en Hertz.
   * @param duration - La duración del sonido en segundos (por defecto es 0.1 segundos).
   */
  static playSound(frequency: number, duration: number = 0.1) {
    // Crear un oscilador, que es un generador de ondas sonoras.
    const oscillator = this.audioContext.createOscillator();
    // Crear un nodo de ganancia para controlar el volumen.
    const gainNode = this.audioContext.createGain();
    // Conectar el oscilador al nodo de ganancia y este al destino del contexto de audio (los altavoces).
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    // Configurar el tipo de onda del oscilador (sine, square, sawtooth, triangle).
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Volume control
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    // Iniciar el oscilador en el tiempo actual.
    oscillator.start(this.audioContext.currentTime);
    // Detener el oscilador después de la duración especificada.
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Reproduce un sonido con una interpolación de frecuencia.
   * @param startFreq - Frecuencia inicial en Hertz.
   * @param endFreq - Frecuencia final en Hertz.
   * @param duration - Duración del sonido en segundos (por defecto es 0.1 segundos).
   */
  static playInterpolatedSound(startFreq: number, endFreq: number, duration: number = 0.1) {
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
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Volume control
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);

    // Iniciar el oscilador en el tiempo actual.
    oscillator.start(this.audioContext.currentTime);
    // Detener el oscilador después de la duración especificada.
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
