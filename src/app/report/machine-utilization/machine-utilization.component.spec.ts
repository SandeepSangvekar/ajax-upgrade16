import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineUtilizationComponent } from './machine-utilization.component';

describe('MachineUtilizationComponent', () => {
  let component: MachineUtilizationComponent;
  let fixture: ComponentFixture<MachineUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineUtilizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
