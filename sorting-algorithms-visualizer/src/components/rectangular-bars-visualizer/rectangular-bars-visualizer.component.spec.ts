import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangularBarsVisualizerComponent } from './rectangular-bars-visualizer.component';

describe('AlgorithmsVisualizerComponent', () => {
  let component: RectangularBarsVisualizerComponent;
  let fixture: ComponentFixture<RectangularBarsVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RectangularBarsVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectangularBarsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
