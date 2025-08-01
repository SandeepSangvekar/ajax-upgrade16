import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcustSegmentationComponent } from './dcust-segmentation.component';

describe('DcustSegmentationComponent', () => {
  let component: DcustSegmentationComponent;
  let fixture: ComponentFixture<DcustSegmentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcustSegmentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcustSegmentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
