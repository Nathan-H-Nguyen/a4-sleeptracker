import { Injectable } from '@angular/core';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepRecord } from '../data/sleep-record';
import { AppStorageService } from './app-storage.service';
import { resolveSleepTimes, dateToISOKey, numDaysAgo } from '../data/sleep-time-utils';

const STORAGE_KEY = 'sleep_data.v1';
const SEED_DEFAULT_DATA = true;

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private AllOvernightData: OvernightSleepData[] = [];
	private AllSleepinessData: StanfordSleepinessData[] = [];

	constructor(private readonly appStorage: AppStorageService) { }

  get allOvernightData(): readonly OvernightSleepData[] {
    return this.AllOvernightData;
  }

  get allSleepinessData(): readonly StanfordSleepinessData[] {
    return this.AllSleepinessData;
  }

  // Returns allOvernightData sorted in order of sleepEnd time
  get sortedAllOvernightData(): OvernightSleepData[] {
    return [...this.AllOvernightData].sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
  }

    // Returns allSleepinessData sorted in order of loggedAt time
  get sortedAllSleepinessData() : StanfordSleepinessData[] {
    return [...this.allSleepinessData].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }

  // Get's the OvernightSleepData record for the given wakeDateKey (YYYY-MM-DD), if it doesn't exist returns undefined
  getNightByWakeDate(wakeDateKey: string): OvernightSleepData | undefined {
    return [...this.AllOvernightData].find(data => data.wakeDateKey === wakeDateKey);
  }

  // Get's the OvernightSleepData record for the last night, if it doesn't exist returns undefined
  getLastNight(): OvernightSleepData | undefined {
    const now = new Date()
    return this.getNightByWakeDate(dateToISOKey(now));
  }

  // Get's the most recent OvernightSleepData record if it exists, else undefined
  getMostRecentNight(): OvernightSleepData | undefined {
    return this.sortedAllOvernightData[0];
  }

    // Returns the last N OvernightSleepData records sorted from oldest to newest, ending today.
  // Days without records receive null
  getLastNNights(n: number): (OvernightSleepData | null)[] {
    const now = new Date();
    var nights: (OvernightSleepData | null)[] = [];

    for (let i = n-1; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      nights.push(this.getNightByWakeDate(dateToISOKey(day)) ?? null);
    }

    return nights;
  }

  getLastNDaysCheckIns(n: number): StanfordSleepinessData[] {
    const now = new Date();
    return this.sortedAllSleepinessData.filter(data => {
      const daysAgo = numDaysAgo(data.loggedAt, now);
      return daysAgo >= 0 && daysAgo < n;
    })
  }

  // Returns the average amount of sleep in hours of the last n days
  nAverageSleepHours(n: number): number | null {
    const nights = this.getLastNNights(n);
    var sum: number = 0;
    var count: number = 0;

    for (const night of nights) {
      if (night !== null) {
        sum += night.durationHours;
        count++;
      }
    }

    return count > 0 ? sum / count : null;
  }

  // Returns the average sleepiness over the last n days
  // NOTE: this is not the average sleepiness over the last n checkins, but the average of all checkins over the last n days
  nAverageSleepiness(n: number): number | null {
    const checkIns = this.getLastNDaysCheckIns(n);

    if (checkIns.length === 0 ) {
      return null;
    }

    var sum: number = 0;
    var count: number = 0;

    for (const checkIn of checkIns) {
      sum += checkIn.loggedValue;
      count++;
    }

    return sum / count;
  }

  async init(): Promise<void> {
    await this.appStorage.init();

    let records: SleepRecord[] | null;

    // Try to load backed-up / logged data, if error then load default data
    try {
      records = await this.appStorage.get(STORAGE_KEY);
    } catch (error) {
      console.error('Error fetching sleep data from storage: ', error);
      ({ overnightSleepData: this.AllOvernightData, sleepinessData: this.AllSleepinessData } = this.createDefaultData());
      return;
    }

    // If no backed-up / logged data, load default data
    if (!Array.isArray(records)) {
      ({ overnightSleepData: this.AllOvernightData, sleepinessData: this.AllSleepinessData } = this.createDefaultData());
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
    if (!SEED_DEFAULT_DATA) {
      return { overnightSleepData: [], sleepinessData: [] };
    }

    var today = new Date();
    var overnightSleepData: OvernightSleepData[] = [];
    var sleepinessData: StanfordSleepinessData[] = [];

    const defaultOvernights = [
      { daysAgo: 6, sleep: [22, 30], wake: [ 6, 45], quality: 4},
      { daysAgo: 5, sleep: [ 0, 40], wake: [ 7, 10], quality: 1},
      { daysAgo: 4, sleep: [23,  0], wake: [12, 30], quality: 5},
      { daysAgo: 3, sleep: [23, 20], wake: [ 7,  5], quality: 3},
      { daysAgo: 2, sleep: [ 9,  0], wake: [16, 30], quality: 3},
      { daysAgo: 1, sleep: [12, 30], wake: [19, 30], quality: 2},
      // { daysAgo: 0, sleep: [ 1, 15], wake: [ 8, 45], quality: 4},
    ];

    for (const overnight of defaultOvernights) {
      var wakeDate = new Date();
      wakeDate.setDate(wakeDate.getDate() - overnight.daysAgo);

      var sleepStartTime = new Date();
      sleepStartTime.setHours(overnight.sleep[0], overnight.sleep[1], 0, 0);

      var sleepEndTime = new Date();
      sleepEndTime.setHours(overnight.wake[0], overnight.wake[1], 0, 0);

      const { sleepStart, sleepEnd } = resolveSleepTimes(
        wakeDate,
        sleepStartTime,
        sleepEndTime
      );

      // Only happens if we try to run the app before the most recent entry (i.e. we seed a 0 daysAgo record)
      if (sleepEnd > today) {
        continue;
      }

      overnightSleepData.push(new OvernightSleepData(sleepStart, sleepEnd, overnight.quality));
    }

    const defaultStanfordSleepiness = [
        { daysAgo: 6, time: [ 9, 15], value: 2 },
        { daysAgo: 6, time: [15, 30], value: 4 },
        { daysAgo: 4, time: [13, 30], value: 1 },
        { daysAgo: 4, time: [18,  0], value: 2 },
        { daysAgo: 3, time: [ 7, 45], value: 3 },
        { daysAgo: 3, time: [15, 10], value: 4 },
        { daysAgo: 3, time: [23, 30], value: 5 },
        { daysAgo: 2, time: [ 3, 30], value: 6 },
        { daysAgo: 2, time: [ 7, 50], value: 7 },
        { daysAgo: 2, time: [18, 15], value: 4 },
        { daysAgo: 1, time: [ 2,  0], value: 5 },
        { daysAgo: 1, time: [10, 38], value: 6 },
        { daysAgo: 1, time: [21,  0], value: 3 },
        // { daysAgo: 0, time: [ 9,  0], value: 2 },
        // { daysAgo: 0, time: [14, 15], value: 2 },
        // { daysAgo: 0, time: [20,  0], value: 1 },
    ];

    for (const sleepiness of defaultStanfordSleepiness) {
      var loggedAt = new Date();
      loggedAt.setDate(loggedAt.getDate() - sleepiness.daysAgo);
      loggedAt.setHours(sleepiness.time[0], sleepiness.time[1], 0, 0);

      // Only happens if we try to run the app before the most recent entry (i.e. we seed a 0 daysAgo record)
      if (loggedAt > today) {
        continue;
      }

      sleepinessData.push(new StanfordSleepinessData(sleepiness.value, loggedAt));
    }

    return { overnightSleepData, sleepinessData };
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
