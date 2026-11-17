import { nanoid } from 'nanoid';
import { SleepRecord } from './sleep-record';

export abstract class SleepData {
	readonly id:string;
	readonly loggedAt:Date;

	constructor(id: string = nanoid(), loggedAt?: Date) {
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged entries the same).
		this.id = id;
		this.loggedAt = loggedAt || new Date();
	}

	summaryString():string {
		return 'Unknown sleep data';
	}

	dateString():string {
		return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

  abstract toJSON(): SleepRecord;
}
