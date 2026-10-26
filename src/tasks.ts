import {Task} from './types';

/** Tasks visible on a given day (one-off on its date, daily-repeat from its start date on). */
export const tasksOn = (tasks: Task[], key: string) =>
  tasks.filter(t => (t.repeat ? t.date <= key : t.date === key));

export const isDone = (t: Task, key: string) => t.doneDates.includes(key);
