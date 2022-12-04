import request from '../request';
import type { Tag } from './types';

async function getAll() {
  const data = await request<Tag[]>({ path: '/tags', method: 'GET' });
  return data;
}

export default getAll;
