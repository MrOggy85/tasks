import request from '../request';

async function remove(id: number) {
  const data = await request<boolean>({
    path: `/tags/${id}`,
    method: 'DELETE',
  });
  return data;
}

export default remove;
