import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortingAlgorithm } from '../../algorithms/sorting-algorithm';
import { ColorUtil } from '../../util/color-util';
import { ArrayUtil } from '../../util/array-util';
import { SortingAlgorithmManager } from '../../algorithms/sorting-algorithm-manager';
import { AudioUtil } from '../../util/audio-util';

@Component({
  selector: 'app-rectangular-bars-visualizer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rectangular-bars-visualizer.component.html',
  styleUrl: './rectangular-bars-visualizer.component.css'
})
export class RectangularBarsVisualizerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;

  private readonly canvasPadding: number = 0.12;

  /* Cantidad de barras a dibujar */
  public numberOfBars: number = 200;
  /* Ancho de las barras */
  private barWidth: number = 0;
  /* Altura de las barras */
  private bars: number[] = [];
  /* Tupla que contiene el paso a paso de la animación al intercambiar elementos del arreglo */
  private shuffleSteps: [number, number][] = [];
  private shuffleDelay: number = 100;

  /* Algoritmo seleccionado en la lista */
  public selectedAlgorithm: string = 'quickSort';
  private selectedAlgorithmInstance: SortingAlgorithm | null = null;

  /* Para controlar las animaciones de los algoritmos */
  private isShuffleAnimationRunning: boolean = false;
  private isAlgorithmAnimationRunning: boolean = false;
  private animationStepIndex: number = 0;
  private animationDelay: number = 100;

  /* Para activar o desactivar los controles */
  public disableSelect = true; // Desactivado por defecto durante la animación inicial
  public disableInputRange = false;
  public disableShuffleButton = false;
  public disableSortButton = false;

  /* Colores para el gradiente */
  private startColor = { r: 51, g: 233, b: 255 };
  private endColor = { r: 91, g: 51, b: 255 };
  /* Colores para comparación e intercambio */
  private readonly comparingColor = 'rgb(225, 115, 4)'; // Naranja
  private readonly swappingColor = 'rgb(238, 46, 75)'; // Rojo

  private readonly soundStartFrequency = 200;
  private readonly soundEndFrequency = 500;

  /**
   * Inicia el canvas y el event loop
   */
  ngAfterViewInit(): void {
    this.setupCanvas();
    this.setupBars();
    this.animate();
    // Por defecto esta seleccionado el quickSort
    this.selectedAlgorithmInstance = SortingAlgorithmManager.getAlgorithmInstance(this.selectedAlgorithm);

    window.addEventListener('resize', this.onResize.bind(this));
    // Agregar eventos para la creación del contexto de audio cuando el usuario haga un gesto sobre la ventana
    // debido a la Autoplay policy https://developer.chrome.com/blog/autoplay/#webaudio
    window.addEventListener('click', () => { AudioUtil.createAudioContext() });
    window.addEventListener('keydown', () => { AudioUtil.createAudioContext() });
  }

  /**
   * Limpia los eventos registrados al destruir el componente
   */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
    window.removeEventListener('click', () => { AudioUtil.suspendAudioContext() });
    window.removeEventListener('keydown', () => { AudioUtil.suspendAudioContext() });
  }

  /**
   * Asigna el tamaño del canvas en base al tamaño de su contenedor
   * y se obtiene el contexto 2D
   */
  private setupCanvas(): void {
    const canvas = this.myCanvas.nativeElement;
    const container = canvas.parentElement;
    // Dar tamaño al canvas en base al tamaño del contenedor y el padding
    if (container) {
      canvas.width = container.clientWidth - (container.clientWidth * this.canvasPadding);
      canvas.height = container.clientHeight - (container.clientHeight * this.canvasPadding);
    }

    this.context = canvas.getContext('2d');
  }

  /**
   * Calcula el ancho y alto de cada barra mientras se redimensiona
   */
  private setupBarsWhileResizing(): void {
    // Calcular ancho de las barras en base al ancho del contenedor y número de barras a dibujar
    this.barWidth = this.myCanvas.nativeElement.width / this.numberOfBars;
    // Obtener altura del canvas
    const canvasHeight = this.myCanvas.nativeElement.height;
    // Si las alturas de las barras ya están definidas, las recalcula proporcionalmente al nuevo tamaño del canvas y la ventana
    const maxBarHeight = Math.max(...this.bars);
    for (let i = 0; i < this.bars.length; i++) {
      this.bars[i] = (this.bars[i] / maxBarHeight) * canvasHeight;
    }
  }

  /**
   * Calcula el ancho y alto de cada barra inicialmente
   */
  private setupBars(): void {
    // Calcular ancho de las barras en base al ancho del contenedor y número de barras a dibujar
    this.barWidth = this.myCanvas.nativeElement.width / this.numberOfBars;
    // Obtener altura del canvas
    const canvasHeight = this.myCanvas.nativeElement.height;
    // Generar arreglo aleatorio entre 1 y numberOfBars - 1
    const randomIndices = ArrayUtil.random(this.numberOfBars);
    // Resetear cantidad de barras
    this.bars = [];
    for (let i = 0; i < this.numberOfBars; i++) {
      this.bars[i] = (randomIndices[i] / this.numberOfBars) * canvasHeight;
    }
    // Desordenar arreglo
    this.prepareShuffle();
  }

  /**
   * Básicamente el event loop... 
   */
  private animate(): void {
    if (!this.context)
      return;

    this.update();
    this.draw();

    requestAnimationFrame(() => this.animate());
  }

  /**
   * Actualiza la posición de los elementos en el canvas
   */
  private update(): void {
    // Si se está desordenando el arreglo
    if (this.isShuffleAnimationActive()) {
      const [index1, index2] = this.shuffleSteps.shift()!;
      const maxBarHeight = Math.max(...this.bars);
      ArrayUtil.swap(this.bars, index1, index2);

      if (AudioUtil.isAudioContextCreated()) {
        // Reproduce sonidos con interpolación basada en la altura de las barras
        AudioUtil.playInterpolatedSound(
          this.soundStartFrequency + (this.bars[index1] / maxBarHeight) * this.soundEndFrequency,
          this.soundStartFrequency + (this.bars[index2] / maxBarHeight) * this.soundEndFrequency,
          0.05
        );
      }

      setTimeout(() => {
        this.isShuffleAnimationRunning = this.shuffleSteps.length > 0;
        // Activar controles una vez termine la animación
        if (!this.isShuffleAnimationRunning) {
          this.disableControls(false);
        }
      }, this.shuffleDelay);
    }

    // Si se está ejecutando un algoritmo de ordenamiento
    if (this.isAlgorithmAnimationRunning && this.selectedAlgorithmInstance) {
      const steps = this.selectedAlgorithmInstance.steps;
      // Animar cada uno de los pasos para crear la animación
      if (this.animationStepIndex < steps.length) {
        // Obtenemos el estado del arreglo en cada paso
        const [arrayState, comparingIndices, swappingIndices] = steps[this.animationStepIndex];
        const maxBarHeight = Math.max(...this.bars);
        // Obtener estado del arreglo en ese momento
        this.bars = arrayState;
        this.animationStepIndex++;

        if (AudioUtil.isAudioContextCreated()) {
          if (comparingIndices.length > 1) {
            // Interpolación entre frecuencias según la altura de las barras comparadas
            const startFreq = this.soundStartFrequency + (this.bars[comparingIndices[0]] / maxBarHeight) * this.soundEndFrequency;
            const endFreq = this.soundStartFrequency + (this.bars[comparingIndices[1]] / maxBarHeight) * this.soundEndFrequency;
            AudioUtil.playInterpolatedSound(startFreq, endFreq, 0.05);
          } else if (swappingIndices.length > 1) {
            // Interpolación entre frecuencias según la altura de las barras intercambiadas
            const startFreq = this.soundStartFrequency + (this.bars[swappingIndices[0]] / maxBarHeight) * this.soundEndFrequency;
            const endFreq = this.soundStartFrequency + (this.bars[swappingIndices[1]] / maxBarHeight) * this.soundEndFrequency;
            AudioUtil.playInterpolatedSound(startFreq, endFreq, 0.05);
          }
        }

        setTimeout(() => {
          this.isAlgorithmAnimationRunning = this.animationStepIndex < steps.length;
          // Activar controles una vez termine la animación
          if (!this.isAlgorithmAnimationRunning) {
            this.disableControls(false);
          }
        }, this.animationDelay);
      }
    }
  }

  /**
   * Dibuja las barras en el canvas
   */
  private draw(): void {
    const canvas = this.myCanvas.nativeElement;

    if (this.context) {
      this.context.clearRect(0, 0, canvas.width, canvas.height);

      // Si se está ejecutando un algoritmo de ordenamiento
      if (this.isAlgorithmAnimationRunning && this.selectedAlgorithmInstance) {
        // Obtener el último paso
        const steps = this.selectedAlgorithmInstance?.steps[this.animationStepIndex - 1];
        // Obtener los indices que se estaban comparando
        const comparingIndices = steps ? steps[1] : [];
        // Obtener los indices que se intercambiaron
        const swappingIndices = steps ? steps[2] : [];

        const maxBarHeight = Math.max(...this.bars);
        for (let i = 0; i < this.numberOfBars; i++) {
          // Asignar color en base al estado y altura de la barra
          if (comparingIndices.includes(i)) {
            this.context.fillStyle = this.comparingColor;
          } else if (swappingIndices.includes(i)) {
            this.context.fillStyle = this.swappingColor;
          } else {
            this.context.fillStyle = ColorUtil.getColorForHeight(this.bars[i], maxBarHeight, this.startColor, this.endColor);
          }

          this.context.fillRect(i * this.barWidth, canvas.height - this.bars[i], this.barWidth, this.bars[i]);
        }
        return;
      }

      const maxBarHeight = Math.max(...this.bars);
      for (let i = 0; i < this.numberOfBars; i++) {
        // Asignar color en base a la altura de la barra
        this.context.fillStyle = ColorUtil.getColorForHeight(this.bars[i], maxBarHeight, this.startColor, this.endColor);
        this.context.fillRect(i * this.barWidth, canvas.height - this.bars[i], this.barWidth, this.bars[i]);
      }

    }
  }

  /**
   * Implementación de Fisher-Yates Sorting Algorithm
   */
  private prepareShuffle(): void {
    // Se genera el paso a paso de elementos a intercambiar en el arreglo para crear la animación
    this.shuffleSteps = ArrayUtil.prepareShuffle(this.bars);
    this.isShuffleAnimationRunning = true;
  }

  /**
   * Redibuja las barras después de ajustar el canvas
   * @param _event 
   */
  @HostListener('window:resize', ['$event'])
  private onResize(_event: Event): void {
    // Ajustar el tamaño del canvas sin interrumpir la animación
    this.setupCanvas();
    this.setupBarsWhileResizing();
  }

  /**
   * Desordena el arreglo de las barras
   */
  public onShuffleArrayBtnClick(_event: Event): void {
    this.prepareShuffle();
    this.disableSelect = this.disableSortButton = true;
  }

  /**
   * Actualiza la cantidad de barras a dinujar según el valor del input range
   * @param _event InputEvent
   */
  onBarsInputChange(_event: Event): void {
    this.setupBars();
    this.draw();
    this.disableSelect = this.disableSortButton = true;
  }

  /**
   * Cambia al algoritmo seleccionado desde el select
   * @param _event 
   */
  onAlgorithmChange(_event: Event) {
    this.selectedAlgorithmInstance = SortingAlgorithmManager.getAlgorithmInstance(this.selectedAlgorithm);
  }

  /**
   * Inicia la animación de ordenamiento
   * @param _event 
   * @returns 
   */
  onSortBtnClick(_event: Event) {
    // Comprobar si se seleccionó un algoritmo existente
    if (!this.selectedAlgorithmInstance) {
      return;
    }
    // Comprobar si el arreglo ya está ordenado
    if (ArrayUtil.isSorted(this.bars)) {
      return;
    }
    // Resetear los pasos de la animación
    this.animationStepIndex = 0;
    // Ordenar el arreglo y generar pasos
    this.selectedAlgorithmInstance.sort([...this.bars]);
    // Iniciar la animación si hay pasos
    if (this.selectedAlgorithmInstance.steps.length > 0) {
      this.isAlgorithmAnimationRunning = true;
      // Desactivar todos los controles mientras esta la animación
      this.disableControls(true);
    }
  }

  /**
   * Desactiva o activa los controles de la UI según sea necesario
   */
  private disableControls(value: boolean): void {
    this.disableSelect = this.disableInputRange = this.disableShuffleButton = this.disableSortButton = value;
  }

  /**
   * Verifica si hay pasos restantes para la animación de desordenamiento.
   * @returns true si la animación de desordenamiento está activa y tiene pasos restantes.
   */
  private isShuffleAnimationActive(): boolean {
    return this.isShuffleAnimationRunning && this.shuffleSteps.length > 0;
  }

}
