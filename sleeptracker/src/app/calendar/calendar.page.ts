import { Component, OnInit} from '@angular/core';
import { IonContent, IonButton, IonIcon, IonItem, IonList, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { dateToISOKey } from '../data/sleep-time-utils';
import { HeaderComponent } from '../components/header/header.component';
import { NightRowComponent } from '../components/night-row/night-row.component';
import { CheckInRowComponent } from '../components/check-in-row/check-in-row.component';
import { ActivatedRoute } from '@angular/router';

interface CalendarCell {
  day: number;
  key: string; // ISO Key
  hasNight: boolean;
  hasCheckIns: boolean;
  isToday: boolean;
  isFuture: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonItem, IonList, IonCard, HeaderComponent, NightRowComponent, CheckInRowComponent]
})
export class CalendarPage implements OnInit {
  readonly weekdayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  todayKey = dateToISOKey(new Date());
  currentMonth: Date;
  selectedKey = this.todayKey;

  constructor(public sleepService:SleepService, public route: ActivatedRoute) {
    addIcons({ chevronBackOutline, chevronForwardOutline });

    const today = new Date();
    this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    const date = this.route.snapshot.queryParamMap.get('date');

    if (date) {
      this.selectedKey = date;
      const temp = new Date(date);
      this.currentMonth = new Date(temp.getFullYear(), temp.getMonth(), 1);
    }
  }


  get monthLabel(): string {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get isCurrentMonth(): boolean {
    return dateToISOKey(this.currentMonth).slice(0, 7) === this.todayKey.slice(0, 7);
  }

  get selectedNight(): OvernightSleepData | undefined {
    return this.sleepService.getNightByWakeDate(this.selectedKey);
  }

  get selectedCheckIns(): StanfordSleepinessData[] {
    return this.sleepService.getCheckInsByWakeDate(this.selectedKey);
  }

  get selectedDayLabel(): string {
    return new Date(`${this.selectedKey}T00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  get cells(): (CalendarCell | null)[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (CalendarCell | null)[] = Array(this.currentMonth.getDay()).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateToISOKey(new Date(year, month, day));

      cells.push({
        day,
        key,
        hasNight: this.sleepService.getNightByWakeDate(key) !== undefined,
        hasCheckIns: this.sleepService.getCheckInsByWakeDate(key).length > 0,
        isToday: key === this.todayKey,
        isFuture: key > this.todayKey
      });
    }

    return cells;
  }

  get loggedNightsCurrentMonth(): number {
    return this.cells.filter(cell => cell?.hasNight).length;
  }

  selectDay(cell: CalendarCell): void {
    if (!cell.isFuture) {
      this.selectedKey = cell.key;
    }
  }

  changeMonth(offset: number): void {
    const next = new Date(this.currentMonth);
    next.setMonth(next.getMonth() + offset);
    this.currentMonth = next;
  }

  cellLabel(cell: CalendarCell): string {
    const date = new Date(`${cell.key}T00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const parts = [date];
    if (cell.hasNight) {
      parts.push('sleep logged');
    }
    if (cell.hasCheckIns) {
      parts.push('check-ins logged');
    }

    return parts.join(', ');
  }
}
