import { Component, OnInit, Input } from '@angular/core';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { starOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-night-row',
  templateUrl: './night-row.component.html',
  styleUrls: ['./night-row.component.scss'],
  imports: [IonIcon],
})
export class NightRowComponent  implements OnInit {
  @Input({ required: true }) night!: OvernightSleepData;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor() {
    addIcons({ starOutline, star });
   }

  ngOnInit() {}

  get day(): number {
    return this.night.sleepEnd.getDate();
  }

  get shortMonth(): string {
    return this.night.sleepEnd.toLocaleDateString('en-US', { month: 'short' });
  }

  get durationHour(): string {
    return `${this.night.durationHours.toFixed(1)}h`;
  }
}
