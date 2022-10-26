import request from '../request';
import type { Tag } from './types';

type Update = {
  id: Tag['id'];
  name: Tag['name'];
  bgColor: Tag['bgColor'];
  textColor: Tag['textColor'];
};

async function update(task: Update): Promise<boolean> {
  const data = await request({
    path: '/tags',
    method: 'PUT',
    data: {
      ...task,
    },
  });
  return data;
}

export default update;
