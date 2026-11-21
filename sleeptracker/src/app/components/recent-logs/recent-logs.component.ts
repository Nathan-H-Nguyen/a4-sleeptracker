import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, moonOutline, sunnyOutline } from 'ionicons/icons';
import { RecentLogsOvernightWeekChartComponent } from '../recent-logs-overnight-week-chart/recent-logs-overnight-week-chart.component';
import { SleepService } from 'src/app/services/sleep.service';

export type RecentLogTab = 'overnight' | 'daytime';

@Component({
  selector: 'app-recent-logs',
  templateUrl: './recent-logs.component.html',
  styleUrls: ['./recent-logs.component.scss'],
  imports: [IonSegment, IonSegmentButton, IonLabel, IonIcon, RecentLogsOvernightWeekChartComponent],
})
export class RecentLogsComponent  implements OnInit {
  @Input({ required: true }) eyebrow!: string;
  @Input({ required: true }) headerText!: string;
  @Input({ required: true }) averageValue!: string | null;
  @Input({ required: true }) selectedTab!: RecentLogTab;
  @Output() selectedTabChange = new EventEmitter<RecentLogTab>;
  constructor(public sleepService:SleepService) {
    addIcons({ moonOutline, sunnyOutline });
   }

   onSegmentChange(event: CustomEvent): void {
    this.selectedTabChange.emit(event.detail.value as RecentLogTab);
   }

  ngOnInit() {}

}
