import request from '../request';
import type { Task } from './types';

type Update = {
  id: Task['id'];
  title: Task['title'];
  description: Task['description'];
  startDate: Task['startDate'];
  endDate: Task['endDate'];
  repeat: Task['repeat'];
  repeatType: Task['repeatType'];
  priority: Task['priority'];
  tagIds: number[];
};

async function update(task: Update) {
  const data = await request<boolean>({
    path: '/tasks',
    method: 'PUT',
    data: {
      ...task,
    },
  });
  return data;
}

export default update;
