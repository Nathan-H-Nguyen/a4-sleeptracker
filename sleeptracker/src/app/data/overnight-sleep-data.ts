import { SleepData } from './sleep-data';
import { OvernightRecord } from './sleep-record';
import { dateToISOKey } from './sleep-time-utils';
import { relativeNightLabel } from './sleep-time-utils';

export class OvernightSleepData extends SleepData {
	readonly sleepStart:Date;
	readonly sleepEnd:Date;
  readonly sleepQuality: number; // Rating 1-5

	constructor(sleepStart:Date, sleepEnd:Date, sleepQuality: number, id?: string, loggedAt?: Date) {
		super(id, loggedAt);

    if (Number.isNaN(sleepStart.getTime()) || Number.isNaN(sleepEnd.getTime())) {
      throw new RangeError("Invalid date");
    }
    if (sleepEnd <= sleepStart) {
      throw new RangeError("Sleep end time must be after sleep start time");
    }
    if (!Number.isInteger(sleepQuality) || (sleepQuality < 1 || sleepQuality > 5)) {
      throw new RangeError("Sleep quality must be an integer between 1 and 5");
    }

		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
		this.sleepQuality = sleepQuality;
	}

  get durationMs(): number {
    return this.sleepEnd.getTime() - this.sleepStart.getTime();
  }

  get durationHours(): number {
    return this.durationMs / (1000 * 60 * 60);
  }

  get qualityLabel(): string {
    switch(this.sleepQuality) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Restful";
      case 5:
        return "Excellent";
      default:
        return "Unknown";
    }
  }

	override summaryString():string {
		var difference_ms = this.durationMs;

		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
    return relativeNightLabel(this.sleepEnd);
	}

  override toJSON(): OvernightRecord {
    return {
      type: 'overnight',
      id: this.id,
      loggedAt: this.loggedAt.toISOString(),
      sleepStart: this.sleepStart.toISOString(),
      sleepEnd: this.sleepEnd.toISOString(),
      sleepQuality: this.sleepQuality
    };
  }

  static fromJSON(overnightRecord: OvernightRecord): OvernightSleepData {
    return new OvernightSleepData(
      new Date(overnightRecord.sleepStart),
      new Date(overnightRecord.sleepEnd),
      overnightRecord.sleepQuality,
      overnightRecord.id,
      new Date(overnightRecord.loggedAt)
    );
  }

  // Get an ISO-8601 formatted key for the day the user woke up
  get wakeDateKey(): string {
    return dateToISOKey(this.sleepEnd);
  }
}
