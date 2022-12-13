import request from '../request';

async function unDone(id: number) {
  const data = await request<boolean>({
    path: `/tasks/${id}/undone`,
    method: 'POST',
  });
  return data;
}

export default unDone;
