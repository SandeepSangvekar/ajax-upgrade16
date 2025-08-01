import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelanalyticsComponent } from './fuelanalytics.component';

describe('FuelanalyticsComponent', () => {
  let component: FuelanalyticsComponent;
  let fixture: ComponentFixture<FuelanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelanalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
