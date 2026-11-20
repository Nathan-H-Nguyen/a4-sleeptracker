import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, addOutline } from 'ionicons/icons';


@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  imports: [IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle]
})
export class ActionButtonComponent  implements OnInit {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Input() tone: 'night' | 'sun' = 'night';
  @Output() pressed = new EventEmitter<void>();
  constructor() {
        addIcons({ moonOutline, sunnyOutline, addOutline });
  }

  ngOnInit() {}

}
