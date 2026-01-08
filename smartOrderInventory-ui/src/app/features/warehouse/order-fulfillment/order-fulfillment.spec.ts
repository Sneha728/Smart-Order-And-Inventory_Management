import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFulfillment } from './order-fulfillment';

describe('OrderFulfillment', () => {
  let component: OrderFulfillment;
  let fixture: ComponentFixture<OrderFulfillment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderFulfillment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderFulfillment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
