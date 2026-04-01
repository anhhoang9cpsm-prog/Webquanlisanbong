import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  // QR code image (placeholder - có thể là URL thật từ backend)
  const QR_CODE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23fff' width='200' height='200'/%3E%3Crect fill='%23000' x='20' y='20' width='160' height='160'/%3E%3Crect fill='%23fff' x='30' y='30' width='50' height='50'/%3E%3Crect fill='%23fff' x='120' y='30' width='50' height='50'/%3E%3Crect fill='%23fff' x='30' y='120' width='50' height='50'/%3E%3C/svg%3E";

  // Nếu không có bookingData, quay về booking page
  if (!bookingData) {
    navigate("/customer/booking");
    return null;
  }

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // Gửi BOOKING REQUEST (chưa là booking chính thức)
      const res = await axios.post(
        "http://localhost:5000/api/booking-requests",
        {
          fieldId: bookingData.fieldId,
          time: bookingData.time,
          totalPrice: bookingData.fieldPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✓ Yêu cầu đặt sân đã được gửi!\nAdmin sẽ xác nhận trong vòng 24 tiếng.");
      navigate("/customer/history");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gửi yêu cầu đặt sân thất bại");
    } finally {
      setLoading(false);
    }
  };

  const role = localStorage.getItem("role");

  return (
    <main className="page">
      <header className="topbar">
        <strong>Thanh Toán</strong>
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
          <h2>Thanh Toán và Xác Nhận Đặt Sân</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="payment-grid">
            {/* CỘT TRÁI - QR CODE */}
            <div className="payment-qr-section">
              <h3>Quét QR để thanh toán</h3>
              <div className="qr-container">
                <div className="qr-code">
                  <img src={QR_CODE_IMAGE} alt="QR Code Thanh Toán" />
                </div>
                <p className="qr-note">
                  📱 Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét QR code
                </p>
                <p className="qr-account">
                  <strong>Chủ sân:</strong> Nguyễn Văn A<br />
                  <strong>Số tài khoản:</strong> 12345678<br />
                  <strong>Ngân hàng:</strong> MB Bank
                </p>
              </div>

              {!isPaid && (
                <div className="payment-confirmation">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      id="paid-checkbox"
                    />
                    <span>✓ Tôi đã thanh toán thành công</span>
                  </label>
                </div>
              )}

              {isPaid && (
                <div className="payment-success">
                  <p className="success-message">
                    ✓ Đã xác nhận thanh toán. Vui lòng ấn nút bên cạnh để hoàn tất!
                  </p>
                </div>
              )}
            </div>

            {/* CỘT PHẢI - CHI TIẾT BOOKING */}
            <div className="payment-details-section">
              <div className="booking-summary">
                <h3>Chi Tiết Yêu Cầu Đặt Sân</h3>

                <div className="summary-section">
                  <div className="summary-item">
                    <span className="label">Sân:</span>
                    <span className="value">{bookingData.fieldName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Loại sân:</span>
                    <span className="value">-</span>
                  </div>
                </div>

                <div className="summary-section">
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

              <div className="payment-status">
                <h4>Trạng Thái Thanh Toán</h4>
                <div className={`status-indicator ${isPaid ? "paid" : "unpaid"}`}>
                  {isPaid ? (
                    <>
                      <span className="status-icon">✓</span>
                      <span className="status-text">Đã Thanh Toán</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">⏳</span>
                      <span className="status-text">Chờ Thanh Toán</span>
                    </>
                  )}
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
                  onClick={handleConfirmPayment}
                  disabled={loading || !isPaid}
                >
                  {loading ? "Đang xử lý..." : "✓ Xác Nhận & Gửi Yêu Cầu"}
                </button>
              </div>

              <p className="payment-note">
                📌 <strong>Lưu ý:</strong><br />
                • Thanh toán thành công để gửi yêu cầu đặt sân<br />
                • Admin sẽ xác nhận và phản hồi trong vòng 24 tiếng<br />
                • Bạn sẽ nhận thông báo qua email khi được xác nhận
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Payment;
