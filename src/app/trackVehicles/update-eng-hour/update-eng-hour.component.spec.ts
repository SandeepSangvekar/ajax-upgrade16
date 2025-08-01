import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEngHourComponent } from './update-eng-hour.component';

describe('UpdateEngHourComponent', () => {
  let component: UpdateEngHourComponent;
  let fixture: ComponentFixture<UpdateEngHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEngHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEngHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
