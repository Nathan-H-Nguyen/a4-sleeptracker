import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecentLogsOvernightWeekChartComponent } from './recent-logs-overnight-week-chart.component';

describe('RecentLogsOvernightWeekChartComponent', () => {
  let component: RecentLogsOvernightWeekChartComponent;
  let fixture: ComponentFixture<RecentLogsOvernightWeekChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentLogsOvernightWeekChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentLogsOvernightWeekChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
