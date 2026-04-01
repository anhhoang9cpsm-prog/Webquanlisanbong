const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["owner", "customer"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", UserSchema);