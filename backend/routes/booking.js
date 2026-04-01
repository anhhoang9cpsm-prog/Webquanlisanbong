const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// Tạo yêu cầu đặt sân (customer)
router.post("/booking-requests", authMiddleware(["customer"]), async (req, res) => {
  try {
    const { fieldId, time, totalPrice } = req.body;

    const booking = new Booking({
      fieldId,
      customerId: req.user.id,
      time,
      totalPrice,
      status: "pending",
    });

    await booking.save();

    res.json({ message: "Yêu cầu đặt sân đã được gửi!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi tạo yêu cầu đặt sân" });
  }
});

// Lấy tất cả yêu cầu đặt sân (owner)
router.get("/booking-requests", authMiddleware(["owner"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("fieldId")
      .populate("customerId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi lấy danh sách yêu cầu" });
  }
});

// Duyệt yêu cầu đặt sân (owner)
router.put("/booking-requests/:id/approve", authMiddleware(["owner"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ message: "Duyệt yêu cầu thành công", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi duyệt yêu cầu" });
  }
});

// Từ chối yêu cầu đặt sân (owner)
router.put("/booking-requests/:id/reject", authMiddleware(["owner"]), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json({ message: "Từ chối yêu cầu thành công", booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi từ chối yêu cầu" });
  }
});

// Lấy danh sách đặt sân của customer
router.get("/customer/bookings", authMiddleware(["customer"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("fieldId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi lấy danh sách đặt sân" });
  }
});

// Hủy đặt sân
router.delete("/booking/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Hủy đặt sân thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi hủy đặt sân" });
  }
});

// Xem danh sách booking (old endpoint - compatible)
router.get("/", authMiddleware(["owner"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("fieldId")
      .populate("customerId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách" });
  }
});

module.exports = router;