import axios, { Method } from 'axios';
import { load } from './localStorage';

type Params = {
  path: string;
  method: Method;
  data?: any;
};

async function request({ path, method, data }: Params) {
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

  return response.data;
}

export default request;
