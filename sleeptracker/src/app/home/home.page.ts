import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HeroCardComponent } from 'src/app/components/hero-card/hero-card.component';
import { ActionButtonComponent } from '../components/action-button/action-button.component';
import { RecentLogTab, RecentLogsComponent } from '../components/recent-logs/recent-logs.component';

type logTag = 'overnight' | 'daytime';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, HeroCardComponent, ActionButtonComponent, RecentLogsComponent],
})
export class HomePage {
  today: Date = new Date();
  selectedTab: RecentLogTab = 'overnight';

  // Header
  eyebrow: string = '';
  headerText: string = '';

  // Hero Card
  constructor(public sleepService:SleepService) {	}

  ionViewWillEnter() {
    this.today = new Date();
    this.eyebrow = this.headerEyebrowText(this.today);
    this.headerText = this.headerGreeting(this.today);
  }

  // Used to get headerText
  private headerGreeting(date: Date): string {
    const hour = this.today.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour > 12 && hour < 17) {
      return 'Good afternoon';
    }

    return 'Good evening';
  }

  private headerEyebrowText(date: Date): string {
    return this.today.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  }

  // Recent Logs
  get averageValue(): string {
    const avg = this.selectedTab === 'overnight' ? this.sleepService.nAverageSleepHours(7) : this.sleepService.nAverageSleepiness(7);

    if (avg === null) {
      return '0.0';
    }

    return this.selectedTab === 'overnight' ? `${avg.toFixed(1)}h` : `${avg.toFixed(1)}`;
  }
}
