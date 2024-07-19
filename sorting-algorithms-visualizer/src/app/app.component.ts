import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlgorithmsVisualizerComponent } from "../components/algorithms-visualizer/algorithms-visualizer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlgorithmsVisualizerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sorting algorithms visualizer';
}
