import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsReports } from './dashboards-reports';

describe('DashboardsReports', () => {
  let component: DashboardsReports;
  let fixture: ComponentFixture<DashboardsReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardsReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
