import { useState, useEffect } from "react";
import { authenticate } from "./db";
import Cookies from "js-cookie";
import Home from "./Home";
import Game from "./Game";

import cocrielogo from "./assets/cocrie-completa.png";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = Cookies.get("username");
    const password = Cookies.get("password");
    if (username && password && authenticate(username, password)) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (authenticate(username, password)) {
      // Armazena as credenciais do usuário em um cookie
      Cookies.set("username", username, { expires: 1 });
      Cookies.set("password", password, { expires: 1 });
      setIsLoggedIn(true);
    } else {
      window.alert("Usuário ou senha não constam no banco de dados!");
    }
  };
  const handleLogout = () => {
    // Remove as credenciais do usuário do cookie
    Cookies.remove("username");
    Cookies.remove("password");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Home onLogout={handleLogout} />;
  }

  return (
    <div className="tela-login">
      <div className="logo-home">
        <img src={cocrielogo} alt="logo-cocrie" />
      </div>
      <div className="formulario">
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
          <input className="btn-entrar" type="submit" value="Entrar" />
        </form>
      </div>
      <div className="game">
        <Game />
      </div>
    </div>
  );
}

export default LoginScreen;
