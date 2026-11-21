import { Component, OnInit, Input } from '@angular/core';
import { StanfordSleepinessData } from 'src/app/data/stanford-sleepiness-data';

@Component({
  selector: 'app-check-in-row',
  templateUrl: './check-in-row.component.html',
  styleUrls: ['./check-in-row.component.scss'],
})
export class CheckInRowComponent  implements OnInit {
  @Input({ required: true }) checkIn!: StanfordSleepinessData
  constructor() { }

  ngOnInit() {}

}
