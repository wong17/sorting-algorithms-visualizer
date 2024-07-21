import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RectangularBarsVisualizerComponent } from "../components/rectangular-bars-visualizer/rectangular-bars-visualizer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RectangularBarsVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sorting algorithms visualizer';
}
