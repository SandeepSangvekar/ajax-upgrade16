import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonIotComponent } from './non-iot.component';

describe('NonIotComponent', () => {
  let component: NonIotComponent;
  let fixture: ComponentFixture<NonIotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonIotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonIotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
