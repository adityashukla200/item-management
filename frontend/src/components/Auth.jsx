import { useState } from "react";
import axios from "axios";

const API = "https://item-management-z7m3.onrender.com";

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/login`, login);
      onLoginSuccess(res.data.token);
    } catch (err) {
      setMsg("Login failed");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    if (register.password !== register.confirmPassword) {
      return setMsg("Passwords do not match");
    }

    try {
      await axios.post(`${API}/api/register`, register);
      setMsg("Registered! Now login");
      setIsLogin(true);
    } catch {
      setMsg("Register failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* TABS */}
        <div style={styles.tabs}>
          <span
            onClick={() => setIsLogin(true)}
            style={isLogin ? styles.active : styles.tab}
          >
            Login
          </span>
          <span
            onClick={() => setIsLogin(false)}
            style={!isLogin ? styles.active : styles.tab}
          >
            Create Account
          </span>
        </div>

        <p>{msg}</p>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input
              placeholder="Email"
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />
            <button style={styles.btn}>LOGIN</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              placeholder="Full Name"
              onChange={(e) =>
                setRegister({ ...register, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) =>
                setRegister({
                  ...register,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button style={styles.btn}>CREATE ACCOUNT</button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f2f2",
  },
  card: {
    width: "300px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "15px",
  },
  tab: {
    cursor: "pointer",
    color: "gray",
  },
  active: {
    cursor: "pointer",
    color: "blue",
    borderBottom: "2px solid blue",
  },
  btn: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "orange",
    border: "none",
    color: "white",
  },
};

export default Auth;