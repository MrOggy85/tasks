import request from '../request';

async function remove(id: number): Promise<boolean> {
  const data = await request({ path: `/tasks/${id}`, method: 'DELETE' });
  return data;
}

export default remove;
