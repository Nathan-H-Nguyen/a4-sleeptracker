import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input({ required: true}) eyebrow!: string;
  @Input({ required: true}) headerText!: string;


  constructor() { }

  ngOnInit() { }
}
