import { useState } from "react";
import axios from "axios";

const API = "https://item-management-z7m3.onrender.com";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(`${API}/api/register`, form);
      setMsg(res.data.message || "Registered successfully");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>

      {msg && <p>{msg}</p>}

      <form onSubmit={handleRegister}>
        <input
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;