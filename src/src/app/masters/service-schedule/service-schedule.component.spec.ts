import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceScheduleComponent } from './service-schedule.component';

describe('ServiceScheduleComponent', () => {
  let component: ServiceScheduleComponent;
  let fixture: ComponentFixture<ServiceScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
