const jwt = require("jsonwebtoken");

// middleware kiểm tra token + role
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // lấy token từ header
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Chưa đăng nhập" });
      }

      const token = authHeader.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, "SECRET_KEY");

      // kiểm tra role nếu có yêu cầu
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }

      // lưu user vào request
      req.user = decoded;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

module.exports = authMiddleware;