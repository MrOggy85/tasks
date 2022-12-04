import request from '../request';

async function remove(id: number) {
  const data = await request<boolean>({ path: `/tasks/${id}`, method: 'DELETE' });
  return data;
}

export default remove;
