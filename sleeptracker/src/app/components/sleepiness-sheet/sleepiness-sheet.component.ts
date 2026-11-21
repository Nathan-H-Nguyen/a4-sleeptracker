import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonItem, IonList, IonRadio, IonRadioGroup, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, sunnyOutline } from 'ionicons/icons';
import { SleepService } from 'src/app/services/sleep.service';
import { StanfordSleepinessData } from 'src/app/data/stanford-sleepiness-data';

@Component({
  selector: 'app-sleepiness-sheet',
  templateUrl: './sleepiness-sheet.component.html',
  styleUrls: ['./sleepiness-sheet.component.scss'],
  imports: [IonButton, IonContent, IonIcon, IonItem, IonList, IonRadio, IonRadioGroup, IonCard]
})
export class SleepinessSheetComponent  implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  readonly sleepinessLevels = [1, 2, 3, 4, 5, 6, 7];
  readonly descriptions = StanfordSleepinessData.ScaleValues;
  selectedLevel: number | null = null;
  isSaving = false;

  constructor(public sleepService:SleepService) {
    addIcons({ close, sunnyOutline });
  }

  ngOnInit() {}

  onLevelChange(event: CustomEvent): void {
    this.selectedLevel = Number(event.detail.value);
  }

  async onSave(): Promise<void> {
    // Only save if a level is selected and not already saving
    if (this.selectedLevel === null || this.isSaving) {
      return;
    }

    this.isSaving = true;

   try {
    await this.sleepService.logSleepinessData(new StanfordSleepinessData(this.selectedLevel));
    this.saved.emit();
   } catch (error) {
    console.error('Failed to save check in', error);
   } finally {
    this.isSaving = false;
   }
  }

  onClose(): void {
    this.closed.emit();
  }
}
