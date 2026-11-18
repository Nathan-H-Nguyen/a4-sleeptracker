/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';
import { StanfordSleepinessRecord } from './sleep-record';
import { relativeMomentLabel } from './sleep-time-utils';

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	readonly loggedValue:number;

	constructor(loggedValue:number, loggedAt?: Date, id?: string) {
		super(id, loggedAt);

    if (!Number.isInteger(loggedValue) || loggedValue < 1 || loggedValue > 7) {
      throw new RangeError("Logged value must be an integer between 1 and 7")
    }

		this.loggedValue = loggedValue;
	}

  get description() {
    return StanfordSleepinessData.ScaleValues[this.loggedValue] ?? "";
  }

	override summaryString():string {
		return this.loggedValue + ": " + this.description;
	}

  override dateString(): string {
    return relativeMomentLabel(this.loggedAt);
  }

  override toJSON(): StanfordSleepinessRecord {
    return {
      type: 'sleepiness',
      id: this.id,
      loggedAt: this.loggedAt.toISOString(),
      loggedValue: this.loggedValue
    };
  }

  static fromJSON(stanfordSleepinessRecord: StanfordSleepinessRecord): StanfordSleepinessData {
    return new StanfordSleepinessData(
      stanfordSleepinessRecord.loggedValue,
      new Date(stanfordSleepinessRecord.loggedAt),
      stanfordSleepinessRecord.id
    );
  }
}
