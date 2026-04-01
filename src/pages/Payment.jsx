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

  const QR_CODE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23fff' width='200' height='200'/%3E%3Crect fill='%23000' x='20' y='20' width='160' height='160'/%3E%3Crect fill='%23fff' x='30' y='30' width='50' height='50'/%3E%3Crect fill='%23fff' x='120' y='30' width='50' height='50'/%3E%3Crect fill='%23fff' x='30' y='120' width='50' height='50'/%3E%3C/svg%3E";

  if (!bookingData) {
    navigate("/customer/booking");
    return null;
  }

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

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

      alert("Yêu Cầu Đặt Sân Đã Được Gửi!\nAdmin Sẽ Xác Nhận Trong Vòng 24 Giờ.");
      navigate("/customer/history");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gửi Yêu Cầu Đặt Sân Thất Bại");
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
            {role === "owner" ? "Dashboard" : "Trang Chủ"}
          </Link>
          <Link to="/customer/booking">Quay Lại</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng Xuất
          </Link>
        </nav>
      </header>

      <section style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {error && <div className="alert alert-error">{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
            {/* QR CODE SECTION */}
            <div className="payment-qr-card">
              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "#1F2937" }}>
                Thanh Toán QR
              </h2>

              <div style={{
                background: "white",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                <div style={{
                  background: "#F9FAFB",
                  padding: "24px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <img src={QR_CODE_IMAGE} alt="QR CODE" style={{ width: "180px", height: "180px" }} />
                </div>

                <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                  Dùng Máy Ảnh Hoặc Thí Dụa Ngân Hàng Để Quét QR Code
                </p>

                <div style={{
                  background: "#F3F4F6",
                  padding: "16px",
                  borderRadius: "10px",
                  textAlign: "left",
                  fontSize: "14px",
                  color: "#4B5563",
                  lineHeight: "1.8"
                }}>
                  <div><strong>Chủ Sân:</strong> Nguyễn Văn A</div>
                  <div><strong>Số Tài Khoản:</strong> 12345678</div>
                  <div><strong>Ngân Hàng:</strong> MB Bank</div>
                </div>

                {/* PAYMENT CONFIRMATION */}
                <div style={{
                  marginTop: "12px",
                  padding: "16px",
                  background: isPaid ? "#DBEAFE" : "#FEE2E2",
                  borderRadius: "10px",
                  borderLeft: `4px solid ${isPaid ? "#3B82F6" : "#EF4444"}`
                }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isPaid ? "#1D4ED8" : "#DC2626"
                  }}>
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        accentColor: "#3B82F6"
                      }}
                    />
                    <span>{isPaid ? "Đã Xác Nhận Thanh Toán" : "Tôi Đã Thanh Toán Thành Công"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* BOOKING DETAILS SECTION */}
            <div>
              {/* BOOKING CARD */}
              <div className="booking-summary-card" style={{
                background: "white",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                marginBottom: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "#1F2937", margin: 0 }}>
                  Chi Tiết Đặt Sân
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ paddingBottom: "16px", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: "6px" }}>
                      Sân Bóng
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937" }}>
                      {bookingData.fieldName}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid #E5E7EB" }}>
                    <div>
                      <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: "6px" }}>
                        Khung Giờ
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#3B82F6" }}>
                        {bookingData.timeLabel}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: "6px" }}>
                        Thời Lượng
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937" }}>
                        2 Giờ
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#F3F4F6", padding: "16px", borderRadius: "10px" }}>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, marginBottom: "8px" }}>
                      Tổng Tiền
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 700, color: "#3B82F6" }}>
                      {bookingData.fieldPrice?.toLocaleString("vi-VN")} d
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS CARD */}
              <div style={{
                background: isPaid ? "#ECFDF5" : "#FEF3C7",
                border: `2px solid ${isPaid ? "#10B981" : "#F59E0B"}`,
                padding: "24px",
                borderRadius: "12px",
                textAlign: "center",
                marginBottom: "24px"
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                  {isPaid ? "+" : "!"}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: isPaid ? "#059669" : "#B45309", marginBottom: "4px" }}>
                  {isPaid ? "Thanh Toán Thành Công" : "Chờ Thanh Toán"}
                </div>
                <div style={{ fontSize: "13px", color: isPaid ? "#047857" : "#9A3412" }}>
                  {isPaid ? "Sẵn Sàng Gửi Yêu Cầu Đặt Sân" : "Hãy Thanh Toán Trước Khi Tiếp Tục"}  
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate("/customer/booking")}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  Quay Lại
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmPayment}
                  disabled={loading || !isPaid}
                  style={{ flex: 1, fontWeight: 700 }}
                >
                  {loading ? "Đang Xử Lý..." : "Xác Nhận & Gửi"}  
                </button>
              </div>

              {/* NOTES */}
              <div style={{
                marginTop: "24px",
                padding: "16px",
                background: "#F9FAFB",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#6B7280",
                lineHeight: "1.8",
                borderLeft: "4px solid #3B82F6"
              }}>
                <strong style={{ color: "#1F2937" }}>Lưu Ý:</strong><br />
                • Thanh Toán Thành Công Để Gửi Yêu Cầu Đặt Sân<br />
                • Admin Sẽ Xác Nhận Trong Vòng 24 Giờ<br />
                • Bạn Sẽ Nhận Thông Báo Qua Email Khi Được Xác Nhận
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Payment;
