const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// đặt sân (customer)
router.post("/", authMiddleware(["customer"]), async (req, res) => {
  const { fieldId, time } = req.body;

  const booking = new Booking({
    fieldId,
    userId: req.user.id,
    time,
  });

  await booking.save();

  res.json({ message: "Đặt sân thành công" });
});

// 👉 xem booking (owner)
router.get("/", authMiddleware(["owner"]), async (req, res) => {
  const bookings = await Booking.find().populate("fieldId");
  res.json(bookings);
});

module.exports = router;