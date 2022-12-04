import request from '../request';
import type { Tag } from './types';

type Add = {
  name: Tag['name'];
  bgColor: Tag['bgColor'];
  textColor: Tag['textColor'];
};

async function add(task: Add) {
  const data = await request<boolean>({
    path: '/tags',
    method: 'POST',
    data: {
      ...task,
    },
  });
  return data;
}

export default add;
