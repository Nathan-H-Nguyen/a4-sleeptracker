import { Component, OnInit, Input } from '@angular/core';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';
import { IonCard } from '@ionic/angular/standalone';

interface ChartDay {
  dayLetter: string; // S M T W T F S
  hours: number | null;
  isToday: boolean;
}

@Component({
  selector: 'app-recent-logs-overnight-week-chart',
  templateUrl: './recent-logs-overnight-week-chart.component.html',
  styleUrls: ['./recent-logs-overnight-week-chart.component.scss'],
  imports: [IonCard],
})
export class RecentLogsOvernightWeekChartComponent  implements OnInit {
  @Input({ required: true }) nights!: (OvernightSleepData | null)[];

  constructor() { }

  ngOnInit() {}

  // Build each days bar chart data
  get days(): ChartDay[] {
    const today = new Date();
    return this.nights.map((night, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (this.nights.length - 1 - i));
      return {
        dayLetter: date.toLocaleDateString('en-us', { weekday: 'narrow' }),
        hours: night?.durationHours ?? null,
        isToday: i === this.nights.length - 1,
      };
    });
  }

  // Bar height on a scale of 0-8 hours
  barHeight(hours: number): number {
    return Math.min(hours / 8, 1) * 100;
  }

  metGoal(hours: number): boolean {
    return hours >= 8;
  }
}
