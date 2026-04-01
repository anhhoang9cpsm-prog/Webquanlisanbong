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

// cập nhật sân (owner)
router.put("/:id", authMiddleware(["owner"]), async (req, res) => {
  try {
    const { name, type, price, image } = req.body;
    const field = await Field.findByIdAndUpdate(
      req.params.id,
      { name, type, price, image },
      { new: true }
    );
    res.json({ message: "Cập nhật sân thành công", field });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật sân" });
  }
});

// xoá sân (owner)
router.delete("/:id", authMiddleware(["owner"]), async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoá sân thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá sân" });
  }
});

module.exports = router;