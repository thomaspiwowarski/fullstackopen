import { useState } from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import Notification from './Notification';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/currentUserReducer';
import { setNotification } from '../reducers/notificationReducer';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      dispatch(setUser(user));
    } catch (error) {
      dispatch(setNotification(error.message, true, 5));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <Notification />
      <div>
        username{' '}
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="text"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" className="loginButton">
        login
      </button>
    </form>
  );
};

export default LoginForm;
