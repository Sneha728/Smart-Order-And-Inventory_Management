import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBilling } from './invoice-billing';

describe('InvoiceBilling', () => {
  let component: InvoiceBilling;
  let fixture: ComponentFixture<InvoiceBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceBilling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceBilling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
