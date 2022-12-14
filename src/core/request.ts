import axios, { Method } from 'axios';
import { load } from './localStorage';

type Params = {
  path: string;
  method: Method;
  data?: unknown;
};

async function request<T = unknown>({ path, method, data }: Params) {
  const baseURL = load('BASE_URL');
  if (!baseURL) {
    throw new Error('No baseURL!');
  }

  const Authorization = load('APP_AUTH');
  if (!Authorization) {
    throw new Error('No Authorization Header!');
  }

  const response = await axios({
    url: path,
    baseURL,
    headers: {
      Authorization,
    },
    method,
    data,
  });

  return response.data as T;
}

export default request;
