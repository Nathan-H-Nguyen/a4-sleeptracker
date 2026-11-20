import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { HeaderComponent } from 'src/app/components/header/header.component';

import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, starOutline, star } from 'ionicons/icons';
import { HeroCardComponent } from 'src/app/components/hero-card/hero-card.component';

type logTag = 'overnight' | 'daytime';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent, HeroCardComponent],
})
export class HomePage {
  today: Date = new Date();

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
}
