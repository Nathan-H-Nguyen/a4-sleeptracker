export interface OvernightRecord {
  type: 'overnight';
  id: string;
  loggedAt: string;
  sleepStart: string;
  sleepEnd: string;
  sleepQuality: number;
};

export interface StanfordSleepinessRecord {
  type: 'sleepiness';
  id: string;
  loggedAt: string;
  loggedValue: number;
}

export type SleepRecord = OvernightRecord | StanfordSleepinessRecord;
