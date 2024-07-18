import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-algorithms-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './algorithms-visualizer.component.html',
  styleUrl: './algorithms-visualizer.component.css'
})
export class AlgorithmsVisualizerComponent implements AfterViewInit {

  @ViewChild('myCanvas', { static: true }) myCanvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;

  /* Cantidad de barras a dibujar */
  private numberOfBars: number = 100;
  /* Ancho de las barras */
  private barWidth: number = 0;
  /* Altura de las barras */
  private barsHeight: number[] = [];

  /**
   * Inicia el canvas y el event loop
   */
  ngAfterViewInit(): void {
    this.setupCanvas();
    this.setupBars();
    this.animate();
  }

  /**
   * Asigna el tamaño del canvas en base al tamaño de su contenedor
   * y se obtiene el contexto 2D
   */
  private setupCanvas(): void {
    const canvas = this.myCanvas.nativeElement;
    const container = canvas.parentElement;

    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    this.context = canvas.getContext('2d');
  }

  /**
   * 
   */
  private setupBars(): void {
    // Calcular ancho de las barras en base al ancho del contenedor y número de barras a dibujar
    this.barWidth = this.myCanvas.nativeElement.width / this.numberOfBars;
    // Calcular altura de cada barra
    const height = this.myCanvas.nativeElement.height / this.numberOfBars;
    for (let i = 1; i <= this.numberOfBars; i++) {
      this.barsHeight[i - 1] = i * height;
    }
  }

  /**
   * 
   */
  private shuffleArray(): void {

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
   * 
   */
  private update(): void {
    const canvas = this.myCanvas.nativeElement;


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
        this.context.fillRect(i * this.barWidth, 0, this.barWidth, this.barsHeight[i ])
      }
    }
  }
}
