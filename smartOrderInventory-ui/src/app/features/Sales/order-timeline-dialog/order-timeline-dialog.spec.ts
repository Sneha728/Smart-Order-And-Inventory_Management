import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTimelineDialog } from './order-timeline-dialog';

describe('OrderTimelineDialog', () => {
  let component: OrderTimelineDialog;
  let fixture: ComponentFixture<OrderTimelineDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTimelineDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTimelineDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
