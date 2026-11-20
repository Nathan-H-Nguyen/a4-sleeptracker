import { Component, OnInit, Input } from '@angular/core';
import { IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, starOutline, star, timeOutline} from 'ionicons/icons';
import { OvernightSleepData } from 'src/app/data/overnight-sleep-data';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss'],
  imports: [IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
})
export class HeroCardComponent  implements OnInit {
  @Input({required: true }) mostRecentNight!: OvernightSleepData | undefined;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor() {
    addIcons({ moonOutline, star, starOutline, timeOutline});
  }

  ngOnInit() {}

}
