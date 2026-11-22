import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon, IonList, IonItem, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { RecentLogsOvernightWeekChartComponent } from '../recent-logs-overnight-week-chart/recent-logs-overnight-week-chart.component';
import { SleepService } from 'src/app/services/sleep.service';
import { NightRowComponent } from '../night-row/night-row.component';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';
import { CheckInRowComponent } from '../check-in-row/check-in-row.component';
import { StanfordSleepinessData } from 'src/app/data/stanford-sleepiness-data';
import { Router } from '@angular/router';
import { dateToISOKey } from 'src/app/data/sleep-time-utils';

export type RecentLogTab = 'overnight' | 'daytime';

@Component({
  selector: 'app-recent-logs',
  templateUrl: './recent-logs.component.html',
  styleUrls: ['./recent-logs.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel, IonIcon, IonList, IonItem, IonCard, RecentLogsOvernightWeekChartComponent, NightRowComponent, CheckInRowComponent],
})
export class RecentLogsComponent  implements OnInit {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) headerText!: string;
  @Input({ required: true }) averageValue!: string | null;
  @Input({ required: true }) selectedTab!: RecentLogTab;
  @Output() selectedTabChange = new EventEmitter<RecentLogTab>;
  constructor(public sleepService:SleepService, public router: Router) {
    addIcons({ moonOutline, sunnyOutline });
   }

   onSegmentChange(event: CustomEvent): void {
    this.selectedTabChange.emit(event.detail.value as RecentLogTab);
   }

  ngOnInit() {}

  get recentNights(): OvernightSleepData[] {
    return this.sleepService.getLastNNights(7).filter((night): night is OvernightSleepData => night != null).reverse();
  }

  private openCalendarDay(dateKey: string) {
    this.router.navigate(['/tabs/calendar'], { queryParams: { date: dateKey } });
  }
  onNightSelected(night: OvernightSleepData): void {
    this.openCalendarDay(night.wakeDateKey);
  }

  onCheckInSelected(checkIn: StanfordSleepinessData): void {
    this.openCalendarDay((dateToISOKey(checkIn.loggedAt)));
  }
}
