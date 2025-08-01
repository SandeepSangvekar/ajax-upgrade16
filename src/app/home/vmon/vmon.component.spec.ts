import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmonComponent } from './vmon.component';

describe('VmonComponent', () => {
  let component: VmonComponent;
  let fixture: ComponentFixture<VmonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
