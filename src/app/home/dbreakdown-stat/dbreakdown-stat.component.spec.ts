import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbreakdownStatComponent } from './dbreakdown-stat.component';

describe('DbreakdownStatComponent', () => {
  let component: DbreakdownStatComponent;
  let fixture: ComponentFixture<DbreakdownStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbreakdownStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbreakdownStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
