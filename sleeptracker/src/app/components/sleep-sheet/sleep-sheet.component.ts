import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IonButton, IonContent, IonDatetime, IonDatetimeButton, IonIcon, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, moonOutline, star, starOutline} from 'ionicons/icons';
import { SleepService } from '../../services/sleep.service';
import { OvernightSleepData } from '../../data/overnight-sleep-data';
import { dateToISOKey, resolveSleepTimes } from '../../data/sleep-time-utils';

@Component({
  selector: 'app-sleep-sheet',
  templateUrl: './sleep-sheet.component.html',
  styleUrls: ['./sleep-sheet.component.scss'],
  imports: [IonButton, IonContent, IonDatetime, IonDatetimeButton, IonIcon, IonModal]
})
export class SleepSheetComponent  implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  readonly stars = [1, 2, 3, 4, 5];
  readonly todayKey = dateToISOKey(new Date());

  sleepStart = `${this.todayKey}T22:00`; // Default to 10:00pm
  sleepEnd = `${this.todayKey}T06:00` // Default to 6:00am
  quality: number | null = null;


  constructor(public sleepService:SleepService) {
    addIcons({ close, moonOutline, star, starOutline });

    // If last night has already been logged then load its current data
    const lastNight = this.sleepService.getLastNight();
    if (lastNight) {
      this.sleepStart = `${this.todayKey}T${lastNight.sleepStart.toTimeString().slice(0, 5)}`;
      this.sleepEnd = `${this.todayKey}T${lastNight.sleepEnd.toTimeString().slice(0, 5)}`;
      this.quality = lastNight.sleepQuality;
    }
  }

  ngOnInit() {}

  get resolvedSleepTimes(): { sleepStart: Date, sleepEnd: Date } {
    return resolveSleepTimes(new Date(`${this.todayKey}T00:00`), new Date(this.sleepStart), new Date(this.sleepEnd));
  }

  get validationError(): string | null {
    const { sleepStart, sleepEnd } = this.resolvedSleepTimes;

    if (sleepEnd.getTime() > Date.now()) {
      return "Wake up time cannot be in the future";
    }

    return null;
  }

  get canSave(): boolean {
    return this.quality !== null && this.validationError === null;
  }

  async onSave(): Promise<void> {
    if (!this.canSave || this.quality === null) {
      return;
    }

    try {
      const { sleepStart, sleepEnd } = this.resolvedSleepTimes;
      const lastNight = this.sleepService.getLastNight();

      if (lastNight) {
        await this.sleepService.updateOvernightData(new OvernightSleepData(sleepStart, sleepEnd, this.quality, lastNight.id, lastNight.loggedAt));
      } else {
        await this.sleepService.logOvernightData(new OvernightSleepData(sleepStart, sleepEnd, this.quality));
      }

      this.saved.emit();
    } catch (error) {
      console.error('Failed to save sleep', error);
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
