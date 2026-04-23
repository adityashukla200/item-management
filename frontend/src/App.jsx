import { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const [token, setToken] = useState(null); // 👈 force login screen

  const handleLogin = (tok) => {
    localStorage.setItem("token", tok);
    setToken(tok);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      {!token ? (
        <Auth onLoginSuccess={handleLogin} />
      ) : (
        <Dashboard onLogout={logout} />
      )}
    </>
  );
}

export default App;