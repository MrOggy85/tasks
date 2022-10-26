import isAfter from 'date-fns/isAfter';
import type { Task } from './tasks/types';
// import sendNotification from './sendNotification';

// type Reminder = {
//   date: Date;
//   taskId: number;
// };

const sent: number[] = [];

export function sendReminder(tasks: Task[]) {
  const dueTasks = tasks.filter((x) => {
    const due = x.endDate ? isAfter(new Date(), new Date(x.endDate)) : false;

    return due && !sent.includes(x.id);
  });

  if (dueTasks.length > 0) {
    sent.push(...dueTasks.map((x) => x.id));
  }

  // dueTasks.forEach((x) => {
  //   sendNotification(x.title, x.description);
  // });
}
