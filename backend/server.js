const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// routes
const fieldRoutes = require("./routes/fields");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");

app.use("/api/fields", fieldRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api", authRoutes);

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/sanbong")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// test API
app.get("/", (req, res) => {
  res.send("✅ Backend đang chạy 🚀 - Phiên bản cập nhật");
});

// chạy server
app.listen(5000, () => {
  console.log("🚀 Server chạy tại http://localhost:5000");
});