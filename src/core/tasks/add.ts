import request from '../request';
import type { Task } from './types';

type Add = {
  title: Task['title'];
  description: Task['description'];
  startDate: Task['startDate'];
  endDate: Task['endDate'];
  repeat: Task['repeat'];
  repeatType: Task['repeatType'];
  priority: Task['priority'];
  tagIds: number[];
};

type RespondeModel = number;

async function add(task: Add) {
  const data = await request<RespondeModel>({
    path: '/tasks',
    method: 'POST',
    data: {
      ...task,
    },
  });
  return data;
}

export default add;
