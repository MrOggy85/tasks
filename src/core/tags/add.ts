import request from '../request';
import type { Tag } from './types';

type Add = {
  name: Tag['name'];
  bgColor: Tag['bgColor'];
  textColor: Tag['textColor'];
};

async function add(task: Add): Promise<boolean> {
  const data = await request({
    path: '/tags',
    method: 'POST',
    data: {
      ...task,
    },
  });
  return data;
}

export default add;
