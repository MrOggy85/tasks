import request from '../request';

async function unDone(id: number): Promise<boolean> {
  const data = await request({ path: `/tasks/${id}/undone`, method: 'POST' });
  return data;
}

export default unDone;
