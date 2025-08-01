import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceNotMappedComponent } from './device-not-mapped.component';

describe('DeviceNotMappedComponent', () => {
  let component: DeviceNotMappedComponent;
  let fixture: ComponentFixture<DeviceNotMappedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceNotMappedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNotMappedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
