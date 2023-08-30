import { useState, useEffect } from 'react';
import { authenticate } from './db';
import Cookies from 'js-cookie';
import Home from './Home';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = Cookies.get('username');
    const password = Cookies.get('password');
    if (username && password && authenticate(username, password)) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (authenticate(username, password)) {
      // Armazena as credenciais do usuário em um cookie
      Cookies.set('username', username, { expires: 1 });
      Cookies.set('password', password, { expires: 1 });
      setIsLoggedIn(true);
    } else {
      window.alert('Usuário ou senha não constam no banco de dados!');
    }
  }
  const handleLogout = () => {
    // Remove as credenciais do usuário do cookie
    Cookies.remove('username');
    Cookies.remove('password');
    setIsLoggedIn(false);
  }

  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nome de usuário:
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <br />
      <label>
        Senha:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <input type="submit" value="Entrar" />
    </form>
  );
}

export default LoginScreen;
