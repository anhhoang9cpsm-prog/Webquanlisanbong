const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: String,
  type: String,
  price: Number,
  image: String, 
});

module.exports = mongoose.model("Field", fieldSchema);