import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DscheduleServiceComponent } from './dschedule-service.component';

describe('DscheduleServiceComponent', () => {
  let component: DscheduleServiceComponent;
  let fixture: ComponentFixture<DscheduleServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DscheduleServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DscheduleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
