import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReferralComponent } from './report-referral.component';

describe('ReportReferralComponent', () => {
  let component: ReportReferralComponent;
  let fixture: ComponentFixture<ReportReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReferralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
