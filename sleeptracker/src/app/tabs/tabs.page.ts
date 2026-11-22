import { Component, OnInit } from '@angular/core';
import { IonToolbar, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon]
})
export class TabsPage implements OnInit {

  constructor() {
    addIcons({ calendarOutline, homeOutline });
  }

  ngOnInit() {
  }

}
