import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';

import Form from './Form';
import Input from './Input';

export default function Login({ onError, onSubmit, setCurrentAuthUser }) {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    api
      .authorize(email, password)
      .then((res) => {
        onSubmit();
        localStorage.setItem('jwt', res.token);
        setCurrentAuthUser({ email });
        // console.log(localStorage.getItem('jwt'));
        navigate('/');
      })
      .catch((res) => {
        onError('Что-то пошло не так! Попробуйте еще раз.', true);
        console.error(res);
      });
  };
  return (
    <Form title="Вход" submitTitle="Войти" name="login" onSubmit={handleLogin}>
      <Input
        name={'email'}
        typeName={'email'}
        inputStyles={{ placeholder: 'Email', required: true, maxLength: '100', minLength: '4' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        name={'password'}
        typeName={'password'}
        inputStyles={{
          placeholder: 'Пароль',
          required: true,
          maxLength: '100',
          minLength: '4',
          type: 'password',
        }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form>
  );
}
