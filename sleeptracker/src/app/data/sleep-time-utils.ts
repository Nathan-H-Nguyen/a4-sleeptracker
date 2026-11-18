// Turn Date into ISO-8601 format (YYYY-MM-DD) and returns it as a string
export function dateToISOKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Resolves a wake date and 2 clock times into correct sleepStart and sleepEnd times
// Both times placed on the calendar wakeDate, if sleepStart is after sleepEnd then we move it back a day
export function resolveSleepTimes(wakeDate: Date, sleepStartTime: Date, sleepEndTime: Date): { sleepStart: Date, sleepEnd: Date } {
  const sleepStart = new Date(wakeDate);
  sleepStart.setHours(sleepStartTime.getHours(), sleepStartTime.getMinutes(), 0, 0);

  const sleepEnd = new Date(wakeDate);
  sleepEnd.setHours(sleepEndTime.getHours(), sleepEndTime.getMinutes(), 0 ,0);

  // If start is after end then that means sleep is from PM -> AM | PM -> PM | AM -> AM so we move start back a day
  if (sleepStart >= sleepEnd) {
    sleepStart.setDate(sleepStart.getDate() - 1);
  }

  return { sleepStart, sleepEnd };
}

export function numDaysAgo(pastDate: Date, laterDate: Date): number {
  const past = new Date(pastDate.getFullYear(), pastDate.getMonth(), pastDate.getDate());
  const later = new Date(laterDate.getFullYear(), laterDate.getMonth(), laterDate.getDate());

  return Math.round((later.getTime() - past.getTime()) / (24 * 60 * 60 * 1000));
}

export function relativeNightLabel(sleepEnd: Date, now: Date = new Date()): string {
  const daysAgo: number = numDaysAgo(sleepEnd, now);

  if (daysAgo <= 0) {
    return 'Last Night';
  } else if ( daysAgo < 7) {
    const weekday = new Date(sleepEnd);
    weekday.setDate(weekday.getDate() - 1); // Offset by one since we are getting the Night we slept, not Day we woke
    return `${weekday.toLocaleDateString('en-US', { weekday: 'long' })} night`;
  }

  return `${daysAgo} days ago`
}

export function relativeMomentLabel(date: Date, now: Date = new Date()): string {
  const daysAgo: number = numDaysAgo(date, now);
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', });

  var dayLabel: string;
  if (daysAgo <= 0) {
    dayLabel = 'Today';
  } else if (daysAgo == 1) {
    dayLabel = 'Yesterday'
  } else if ( daysAgo < 7) {
    dayLabel = `${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
  } else {
    dayLabel = `${daysAgo} days ago`
  }

  return `${dayLabel} at ${time}`;
}
