import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertanalyticsComponent } from './alertanalytics.component';

describe('AlertanalyticsComponent', () => {
  let component: AlertanalyticsComponent;
  let fixture: ComponentFixture<AlertanalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertanalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
