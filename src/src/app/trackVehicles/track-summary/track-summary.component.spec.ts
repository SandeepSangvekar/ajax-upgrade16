import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackSummaryComponent } from './track-summary.component';

describe('TrackSummaryComponent', () => {
  let component: TrackSummaryComponent;
  let fixture: ComponentFixture<TrackSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
