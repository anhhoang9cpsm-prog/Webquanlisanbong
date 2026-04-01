import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Nếu không có bookingData, quay về booking page
  if (!bookingData) {
    navigate("/customer/booking");
    return null;
  }

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Submit booking
      const res = await axios.post(
        "http://localhost:5000/api/booking",
        {
          fieldId: bookingData.fieldId,
          time: bookingData.time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✓ Đặt sân thành công!");
      navigate("/customer/history");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đặt sân thất bại");
    } finally {
      setLoading(false);
    }
  };

  const role = localStorage.getItem("role");

  return (
    <main className="page">
      <header className="topbar">
        <strong>Confirmation & Thanh Toán</strong>
        <nav className="navbar">
          <Link to={role === "owner" ? "/owner" : "/customer"}>
            {role === "owner" ? "Dashboard" : "Trang chủ"}
          </Link>
          <Link to="/customer/booking">Quay lại</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng xuất
          </Link>
        </nav>
      </header>

      <section className="payment-container">
        <div className="payment-card">
          <h2>Xác nhận đặt sân</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="booking-summary">
            <div className="summary-section">
              <h3>Thông tin sân</h3>
              <div className="summary-item">
                <span className="label">Tên sân:</span>
                <span className="value">{bookingData.fieldName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Giá:</span>
                <span className="value price">
                  {bookingData.fieldPrice?.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <div className="summary-section">
              <h3>Thời gian đặt sân</h3>
              <div className="summary-item">
                <span className="label">Khung giờ:</span>
                <span className="value time">{bookingData.timeLabel}</span>
              </div>
              <div className="summary-item">
                <span className="label">Thời lượng:</span>
                <span className="value">2 tiếng</span>
              </div>
            </div>

            <div className="summary-section total">
              <div className="summary-item">
                <span className="label">Tổng tiền:</span>
                <span className="value total-price">
                  {bookingData.fieldPrice?.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>

          <div className="payment-method">
            <h3>Phương thức thanh toán</h3>
            <div className="method-option selected">
              <input type="radio" id="cash" name="payment" checked disabled />
              <label htmlFor="cash">
                <strong>Thanh toán tại sân</strong>
                <p>Bạn sẽ thanh toán khi đến sân</p>
              </label>
            </div>
          </div>

          <div className="payment-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/customer/booking")}
              disabled={loading}
            >
              Quay lại
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "✓ Xác nhận đặt sân"}
            </button>
          </div>

          <p className="payment-note">
            📌 Lưu ý: Bạn sẽ nhận được xác nhận qua email. Vui lòng đến sân 15 phút trước giờ đặt.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Payment;
