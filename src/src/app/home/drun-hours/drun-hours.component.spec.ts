import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrunHoursComponent } from './drun-hours.component';

describe('DrunHoursComponent', () => {
  let component: DrunHoursComponent;
  let fixture: ComponentFixture<DrunHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrunHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrunHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
