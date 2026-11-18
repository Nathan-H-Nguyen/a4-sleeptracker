import { Injectable } from '@angular/core';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepRecord } from '../data/sleep-record';
import { AppStorageService } from './app-storage.service';

const STORAGE_KEY = 'sleep_data.v1';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private AllOvernightData: OvernightSleepData[] = [];
	private AllSleepinessData: StanfordSleepinessData[] = [];

	constructor(private readonly appStorage: AppStorageService) { }

  get allOvernightData(): OvernightSleepData[] {
    return this.AllOvernightData;
  }

  get allSleepinessData(): StanfordSleepinessData[] {
    return this.AllSleepinessData;
  }

  async init(): Promise<void> {
    await this.appStorage.init();

    let records: SleepRecord[] | null;

    // Try to load backed-up / logged data, if error then load default data
    try {
      records = await this.appStorage.get(STORAGE_KEY);
    } catch (error) {
      console.error('Error fetching sleep data from storage: ', error);
      ({ overnight: this.AllOvernightData, sleepiness: this.AllSleepinessData } = this.createDefaultData());
      return;
    }

    // If no backed-up / logged data, load default data
    if (!Array.isArray(records)) {
      ({ overnight: this.AllOvernightData, sleepiness: this.AllSleepinessData } = this.createDefaultData());
      await this.persist(); // Persist the default data to storage
      return;
    }

    // Deserialize records into OvernightSleepData and StanfordSleepinessData data classes
    for (const record of records) {
      try {
        switch (record.type) {
          case 'overnight':
            this.AllOvernightData.push(OvernightSleepData.fromJSON(record));
            break;
          case 'sleepiness':
            this.AllSleepinessData.push(StanfordSleepinessData.fromJSON(record));
            break;
          default:
            console.warn('Unknown sleep record type, skipping record', record);
        }
      } catch (error) {
        console.error('Error deserializing sleep record, skipping record: ', error);
      }
    }
  }

	private createDefaultData() {
    // Wake time was yesterday at 9:03am, this counts as overnight sleep for the day before yesterday, the Night of 2 days ago
    var firstBedTime = new Date();
    firstBedTime.setDate(firstBedTime.getDate() - 1); //set to yesterday
		firstBedTime.setHours(1, 3, 0, 0); //1:03am
    var firstWakeTime = new Date();
    firstWakeTime.setTime(firstBedTime.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am

    // Wake time was today at 8:11am, this counts as overnight sleep for today, the Night of 1 day ago
    var secondBedTime = new Date();
    secondBedTime.setDate(secondBedTime.getDate() - 1); //set to yesterday
    secondBedTime.setHours(23, 11, 0, 0); //11:11pm
    var secondWakeTime = new Date();
    secondWakeTime.setTime(secondBedTime.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours, waking up at 8:11am

    // Wake time was 2 days ago at 6:28am, this counts as overnight sleep for the day 3 days ago, the Night of 3 days ago
    var thirdBedTime = new Date();
    thirdBedTime.setDate(thirdBedTime.getDate() - 3); //set to day before yesterday
    thirdBedTime.setHours(22, 10, 0, 0); //10:10pm
    var thirdWakeTime = new Date();
    thirdWakeTime.setTime(thirdBedTime.getTime() + 8 * 60 * 60 * 1000 + 18 * 60 * 1000); //Sleep for eight hours and 18 minutes, waking up at 6:28am

    // Sleepiness rating for yesterday
    var firstSleepinessDate = new Date();
    firstSleepinessDate.setDate(firstSleepinessDate.getDate() - 1); //set to yesterday
    firstSleepinessDate.setHours(14, 38, 0, 0); //2:38pm

    // Sleepiness rating for the day before yesterday
    var secondSleepinessDate = new Date();
    secondSleepinessDate.setDate(secondSleepinessDate.getDate() - 2); //set to yesterday
    secondSleepinessDate.setHours(12, 1, 0); //12:01pm

    return {
      overnight: [
        new OvernightSleepData(firstBedTime, firstWakeTime, 3),
        new OvernightSleepData(secondBedTime, secondWakeTime, 4),
        new OvernightSleepData(thirdBedTime, thirdWakeTime, 5)
      ],
      sleepiness: [
        new StanfordSleepinessData(4, firstSleepinessDate),
        new StanfordSleepinessData(6, secondSleepinessDate),
      ]
    }
	}

  // Log overnight data into RAM and persistent storage
	async logOvernightData(sleepData: OvernightSleepData) {
		this.AllOvernightData.push(sleepData);
    await this.persist();
	}

  // Log sleepiness data into RAM and persistent storage
	async logSleepinessData(sleepData: StanfordSleepinessData) {
		this.AllSleepinessData.push(sleepData);
    await this.persist();
	}

  // Persist the current sleep data to storage
  private async persist() {
    const records = [...this.AllOvernightData, ...this.AllSleepinessData].map(data => data.toJSON());
    await this.appStorage.set(STORAGE_KEY, records);
  }
}
