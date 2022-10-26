import request from '../request';
import type { Task } from './types';

async function getAll(): Promise<Task[]> {
  const data = await request({ path: '/tasks', method: 'GET' });
  return data;
}

export default getAll;
