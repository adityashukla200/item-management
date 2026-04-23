import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://item-management-z7m3.onrender.com";

function Dashboard({ onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    type: "lost",
    location: "",
  });
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ================= GET ITEMS =================
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items`, { headers });
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ================= ADD ITEM =================
  const addItem = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/api/items`, form, { headers });

      setForm({
        name: "",
        description: "",
        category: "",
        type: "lost",
        location: "",
      });

      fetchItems();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    await axios.delete(`${API}/api/items/${id}`, { headers });
    fetchItems();
  };

  // ================= UPDATE =================
  const updateItem = async (id) => {
    const newLocation = prompt("Enter new location:");
    if (!newLocation) return;

    await axios.put(
      `${API}/api/items/${id}`,
      { location: newLocation },
      { headers }
    );

    fetchItems();
  };

  // ================= SEARCH =================
  const handleSearch = async () => {
    const res = await axios.get(
      `${API}/api/items/search?name=${search}`,
      { headers }
    );
    setItems(res.data);
  };

  return (
    <div className="dashboard">

      <button onClick={onLogout}>Logout</button>

      {/* ADD ITEM */}
      <form onSubmit={addItem}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <button>Add Item</button>
      </form>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* LIST */}
      {items.map((item) => (
        <div key={item._id} className="item">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>{item.location}</p>
          <p>{item.type}</p>

          <button onClick={() => updateItem(item._id)}>Update</button>
          <button onClick={() => deleteItem(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;