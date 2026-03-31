const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
  },
  userId: String,
  time: String,
});

module.exports = mongoose.model("Booking", bookingSchema);