import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-algorithms-visualizer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './algorithms-visualizer.component.html',
  styleUrl: './algorithms-visualizer.component.css'
})
export class AlgorithmsVisualizerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('myCanvas', { static: true }) myCanvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;

  private readonly canvasPadding: number = 0.12;

  /* Cantidad de barras a dibujar */
  public numberOfBars: number = 100;
  /* Ancho de las barras */
  private barWidth: number = 0;
  /* Altura de las barras */
  private barsHeight: number[] = [];
  /* Tupla que contiene el paso a paso de la animación al intercambiar elementos del arreglo */
  private shuffleSteps: [number, number][] = [];
  private shuffleDelay: number = 500;

  /* Algoritmo seleccionado en la lista */
  public selectedAlgorithm: string = 'mergeSort';

  private isShuffleAnimationRunning: boolean = false;

  /**
   * Inicia el canvas y el event loop
   */
  ngAfterViewInit(): void {
    this.setupCanvas();
    this.setupBars();
    this.animate();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  /**
   * 
   */
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
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
   * Calcula el ancho y alto de cada barra
   */
  private setupBarsWhileResizing(): void {
    // Calcular ancho de las barras en base al ancho del contenedor y número de barras a dibujar
    this.barWidth = this.myCanvas.nativeElement.width / this.numberOfBars;
    // Obtener altura del canvas
    const canvasHeight = this.myCanvas.nativeElement.height;
    // Si las alturas de las barras ya están definidas, las recalcula proporcionalmente al nuevo tamaño del canvas y la ventana
    const maxBarHeight = Math.max(...this.barsHeight);
    for (let i = 0; i < this.barsHeight.length; i++) {
      this.barsHeight[i] = (this.barsHeight[i] / maxBarHeight) * canvasHeight;
    }
  }

  private setupBars(): void {
    // Calcular ancho de las barras en base al ancho del contenedor y número de barras a dibujar
    this.barWidth = this.myCanvas.nativeElement.width / this.numberOfBars;
    // Obtener altura del canvas
    const canvasHeight = this.myCanvas.nativeElement.height;
    for (let i = 1; i <= this.numberOfBars; i++) {
      this.barsHeight[i - 1] = (i / this.numberOfBars) * canvasHeight;
    }
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
    const canvas = this.myCanvas.nativeElement;
    // Si se está desordenando el arreglo
    if (this.isShuffleAnimationRunning && this.shuffleSteps.length > 0) {
      const [index1, index2] = this.shuffleSteps.shift()!;
      this.swap(index1, index2);

      setTimeout(() => {
        this.isShuffleAnimationRunning = this.shuffleSteps.length > 0;
      }, this.shuffleDelay);
    }
  }

  /**
   * 
   */
  private draw(): void {
    const canvas = this.myCanvas.nativeElement;
    if (this.context) {
      // Clear the canvas
      this.context.clearRect(0, 0, canvas.width, canvas.height);

      this.context.fillStyle = '#4f81c2'
      for (let i = 0; i < this.numberOfBars; i++) {
        this.context.fillRect(i * this.barWidth, 0, this.barWidth, this.barsHeight[i])
      }
    }
  }

  /**
   * Implementación de Fisher-Yates Sorting Algorithm
   */
  private prepareShuffle(): void {
    this.shuffleSteps = [];
    // Se genera el paso a paso de elementos a intercambiar en el arreglo para crear la animación
    for (let i = this.barsHeight.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.shuffleSteps.push([i, j]);
    }

    this.isShuffleAnimationRunning = true;
  }

  /**
   * Intercambia de lugar dos elementos del arreglo
   * @param array 
   * @param index1 
   * @param index2 
   */
  swap(index1: number, index2: number): void {
    [this.barsHeight[index1], this.barsHeight[index2]] = [this.barsHeight[index2], this.barsHeight[index1]];
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
  }

  /**
   * Actualiza la cantidad de barras a dinujar según el valor del input range
   * @param _event InputEvent
   */
  onBarsInputChange(_event: Event): void {
    this.setupBars();
    this.draw();
  }

  /**
   * 
   * @param _event 
   */
  onAlgorithmChange(_event: Event) {

  }

}
