const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const fieldRoutes = require("./routes/field");
const bookingRoutes = require("./routes/booking");

app.use("/api/fields", fieldRoutes);
app.use("/api/booking", bookingRoutes);

// middleware
app.use(express.json());
app.use(cors());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/sanbong")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// test API
app.get("/", (req, res) => {
  res.send("Backend đang chạy 🚀");
});

// chạy server
app.listen(5000, () => {
  console.log("Server chạy tại http://localhost:5000");
});
const authRoutes = require("./routes/auth");

app.use("/api", authRoutes);