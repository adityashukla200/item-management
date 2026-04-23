const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===========================
   CORS
=========================== */
app.use(cors());
app.use(express.json());

/* ===========================
   MongoDB Connection
=========================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* ===========================
   USER SCHEMA
=========================== */
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

/* ===========================
   ITEM SCHEMA (IMPORTANT)
=========================== */
const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  description: String,
  category: String,
  type: { type: String, enum: ["lost", "found"] },
  location: String,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

/* ===========================
   AUTH MIDDLEWARE
=========================== */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

/* ===========================
   AUTH ROUTES
=========================== */

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hash });
    await user.save();

    res.json({ message: "Registered Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ===========================
   ITEM ROUTES
=========================== */

// ADD ITEM (Lost / Found)
app.post("/api/items", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, type, location } = req.body;

    const item = new Item({
      userId: req.user.id,
      name,
      description,
      category,
      type,
      location
    });

    await item.save();

    res.json({ message: "Item added", item });

  } catch (err) {
    res.status(500).json({ message: "Error adding item" });
  }
});

// GET ALL ITEMS
app.get("/api/items", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items" });
  }
});

// SEARCH ITEMS
app.get("/api/items/search", authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;

    const items = await Item.find({
      name: { $regex: name, $options: "i" }
    });

    res.json(items);

  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

// UPDATE ITEM
app.put("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update error" });
  }
});

// DELETE ITEM
app.delete("/api/items/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();

    res.json({ message: "Item deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete error" });
  }
});

/* ===========================
   SERVER
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});