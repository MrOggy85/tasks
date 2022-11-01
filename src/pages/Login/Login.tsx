import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Input from '../../components/InputField';
import { load, save } from '../../core/localStorage';

const Login = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [appAuth, setAppAuth] = useState('');

  useEffect(() => {
    setBaseUrl(load('BASE_URL'));
    setAppAuth(load('APP_AUTH'));
  }, []);

  const onClick = () => {
    save('BASE_URL', baseUrl);
    save('APP_AUTH', appAuth);

    window.location.href = '/';
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <Input
        type="text"
        label="Base Url"
        value={baseUrl}
        onChange={setBaseUrl}
      />
      <Input
        type="password"
        label="App Auth"
        value={appAuth}
        onChange={setAppAuth}
      />
      <Button disabled={!baseUrl || !appAuth} color="primary" onClick={onClick}>
        Login
      </Button>
    </Container>
  );
};

export default Login;
