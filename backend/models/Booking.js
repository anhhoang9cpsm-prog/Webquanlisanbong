const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: String, // Format: YYYY-MM-DD
  time: String, // Format: HH:00
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);