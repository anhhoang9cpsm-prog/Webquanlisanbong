const express = require("express");
const router = express.Router();
const Field = require("../models/Field");
const authMiddleware = require("../middleware/authMiddleware");

// thêm sân (owner)
router.post("/", authMiddleware(["owner"]), async (req, res) => {
  const { name, type, price, image } = req.body;

  const field = new Field({
    name,
    type,
    price,
    image, 
  });

  await field.save();

  res.json({ message: "Thêm sân thành công" });
});

// lấy danh sách sân (ai cũng xem được)
router.get("/", async (req, res) => {
  const fields = await Field.find();
  res.json(fields);
});

module.exports = router;