import type { RootState } from './redux/store';

type Task = RootState['tasks']['tasks'][0];
type CronType =
  | 'daily'
  | 'weekdays'
  | 'weekends'
  | 'weekly'
  | 'monthly'
  | 'yearly';

/**
 * 0 = SUN
 * 1 = MON
 * 2 = TUE
 * 3 = WED
 * 4 = THU
 * 5 = FRI
 * 6 = SAT
 *
 * Examples:
 *
 * every Monday: "0 0 * * MON"
 * every Tuesday: "0 0 * * TUE"
 * etc..
 *
 * every weekday: "0 0 * * 1-5"
 *
 * every month: "0 0 1 * *" (on the 1st)
 * every month: "0 0 15 * *" (on the 15th)
 *
 * every year: "0 0 29 5 *" (on the 29th of May)
 */

function getCron(
  type: CronType,
  endDate: Date | undefined,
  repeatType: Task['repeatType'],
) {
  const fromDate =
    repeatType === 'endDate' ? endDate || new Date() : new Date();

  const minutes = fromDate.getMinutes();
  const hour = fromDate.getHours();
  let day = fromDate.getDate().toString();
  let month = fromDate.getMonth().toString();
  let dayWeek = '*';

  if (type === 'daily') {
    day = '*';
    month = '*';
  }

  if (type === 'monthly') {
    month = '*/1';
  }

  if (type === 'weekly') {
    day = '*';
    month = '*';
    dayWeek = fromDate.getDay().toString();
  }

  return `${minutes} ${hour} ${day} ${month} ${dayWeek}`;
}

export default getCron;
