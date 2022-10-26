import axios, { Method } from 'axios';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);

if (!REACT_APP_BASE_URL) {
  throw new Error('REACT_APP_BASE_URL is empty!');
}

const REACT_APP_AUTH = process.env.REACT_APP_AUTH;
console.log('REACT_APP_AUTH', REACT_APP_AUTH);

if (!REACT_APP_AUTH) {
  throw new Error('REACT_APP_AUTH is empty!');
}

type Params = {
  path: string;
  method: Method;
  data?: any;
};

async function request({ path, method, data }: Params) {
  const baseURL = REACT_APP_BASE_URL;
  if (!baseURL) {
    throw new Error('No baseURL!');
  }

  const Authorization = REACT_APP_AUTH;
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
