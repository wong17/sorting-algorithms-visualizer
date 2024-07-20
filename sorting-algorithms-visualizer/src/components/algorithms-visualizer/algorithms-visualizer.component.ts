import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SortingAlgorithm } from '../../algorithms/sorting-algorithm';
import { MergeSort } from '../../algorithms/merge-sort';

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
  private selectedAlgorithmInstance: SortingAlgorithm | null = null;

  private algorithms: { [key: string]: SortingAlgorithm } = {
    mergeSort: new MergeSort()
  };

  private isShuffleAnimationRunning: boolean = false;
  private isAlgorithmAnimationRunning: boolean = false;
  private animationStepIndex: number = 0;
  private animationDelay: number = 500;

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
   * Limpia los eventos registrados al destruir el componente
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
   * Calcula el ancho y alto de cada barra mientras se redimensiona
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

  /**
   * Calcula el ancho y alto de cada barra inicialmente
   */
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

    // Si se está ejecutando un algoritmo de ordenamiento
    if (this.isAlgorithmAnimationRunning && this.selectedAlgorithmInstance) {
      const steps = this.selectedAlgorithmInstance.steps;
      // Animar cada uno de los pasos para crear la animación
      if (this.animationStepIndex < steps.length) {
        // Obtenemos un paso a la vez
        const [arrayState, comparingIndices, swappingIndices] = steps[this.animationStepIndex];
        // Obtener estado del arreglo en ese momento
        this.barsHeight = arrayState;
        this.animationStepIndex++;

        setTimeout(() => {
          this.isAlgorithmAnimationRunning = this.animationStepIndex < steps.length;
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
      // Clear the canvas
      this.context.clearRect(0, 0, canvas.width, canvas.height);

      // Si se está ejecutando un algoritmo de ordenamiento
      if (this.isAlgorithmAnimationRunning && this.selectedAlgorithmInstance) {
        // Obtener el último paso
        const steps = this.selectedAlgorithmInstance?.steps[this.animationStepIndex - 1];
        // Obtener los indices que se estaban comparando
        const comparingIndices = steps ? steps[1] : [];
        // Obtener los indices que se intercambiaron
        const swappingIndices = steps ? steps[2] : [];

        for (let i = 0; i < this.numberOfBars; i++) {
          // Asignar color en base al estado de la barra
          if (comparingIndices.includes(i)) {
            this.context.fillStyle = '#ffa500'; // Naranja para comparación
          } else if (swappingIndices.includes(i)) {
            this.context.fillStyle = '#ff0000'; // Rojo para intercambio
          } else {
            this.context.fillStyle = '#4f81c2'; // Azul por defecto
          }

          // Dibujar la barra
          this.context.fillRect(i * this.barWidth, canvas.height - this.barsHeight[i], this.barWidth, this.barsHeight[i]);
        }
        return;
      }

      this.context.fillStyle = '#4f81c2'; // Azul por defecto
      for (let i = 0; i < this.numberOfBars; i++) {
        // Dibujar la barra
        this.context.fillRect(i * this.barWidth, canvas.height - this.barsHeight[i], this.barWidth, this.barsHeight[i]);
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
   * @param index1 - Índice del primer elemento
   * @param index2 - Índice del segundo elemento
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
   * Cambia el algoritmo seleccionado y prepara la animación para el nuevo algoritmo
   * @param _event 
   */
  onAlgorithmChange(_event: Event) {
    this.selectedAlgorithmInstance = this.algorithms[this.selectedAlgorithm];
    this.animationStepIndex = 0;

    if (this.selectedAlgorithmInstance) {
      this.selectedAlgorithmInstance.sort([...this.barsHeight]);
      this.isAlgorithmAnimationRunning = true;
    }
  }

}
