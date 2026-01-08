import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceInvoice } from './finance-invoice';

describe('FinanceInvoice', () => {
  let component: FinanceInvoice;
  let fixture: ComponentFixture<FinanceInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceInvoice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
