import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DtperformerComponent } from './dtperformer.component';

describe('DtperformerComponent', () => {
  let component: DtperformerComponent;
  let fixture: ComponentFixture<DtperformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DtperformerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DtperformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
