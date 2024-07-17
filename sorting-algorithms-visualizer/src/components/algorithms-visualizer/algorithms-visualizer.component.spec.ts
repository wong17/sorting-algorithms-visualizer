import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmsVisualizerComponent } from './algorithms-visualizer.component';

describe('AlgorithmsVisualizerComponent', () => {
  let component: AlgorithmsVisualizerComponent;
  let fixture: ComponentFixture<AlgorithmsVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgorithmsVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmsVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
