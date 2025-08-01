import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OemManagementComponent } from './oem-management.component';

describe('OemManagementComponent', () => {
  let component: OemManagementComponent;
  let fixture: ComponentFixture<OemManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OemManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
