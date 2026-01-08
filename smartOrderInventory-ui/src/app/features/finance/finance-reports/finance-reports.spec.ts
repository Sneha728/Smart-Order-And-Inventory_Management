import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceReports } from './finance-reports';

describe('FinanceReports', () => {
  let component: FinanceReports;
  let fixture: ComponentFixture<FinanceReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
