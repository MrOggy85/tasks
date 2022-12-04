import request from '../request';

async function done(id: number) {
  const data = await request<boolean>({ path: `/tasks/${id}/done`, method: 'POST' });
  return data;
}

export default done;
