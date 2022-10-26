import request from '../request';

async function done(id: number): Promise<boolean> {
  const data = await request({ path: `/tasks/${id}/done`, method: 'POST' });
  return data;
}

export default done;
