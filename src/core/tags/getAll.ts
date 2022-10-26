import request from '../request';
import type { Tag } from './types';

async function getAll(): Promise<Tag[]> {
  const data = await request({ path: '/tags', method: 'GET' });
  return data;
}

export default getAll;
