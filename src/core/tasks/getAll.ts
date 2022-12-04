import request from '../request';
import type { Task } from './types';

async function getAll() {
  const data = await request<Task[]>({ path: '/tasks', method: 'GET' });
  return data;
}

export default getAll;
