import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BookingHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/");
        return;
      }

      const endpoint = role === "owner" 
        ? "http://localhost:5000/api/booking"
        : "http://localhost:5000/api/booking/customer/bookings";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không Thể Tải Lịch Sử Đặt Sân");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn Chắc Chắn Muốn Hủy Đặt Sân Này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/booking/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Hủy Đặt Sân Thành Công");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Hủy Đặt Sân Thất Bại");
    }
  };

  const role = localStorage.getItem("role");

  return (
    <main className="page">
      <header className="topbar">
        <strong>
          {role === "owner" ? "Lịch Đặt Sân" : "Lịch Sử Đặt Sân"}
        </strong>
        <nav className="navbar">
          <Link to={role === "owner" ? "/owner" : "/customer"}>
            {role === "owner" ? "Dashboard" : "Trang Chủ"}
          </Link>
          <Link to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quản Lý Sân" : "Đặt Sân"}
          </Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng Xuất
          </Link>
        </nav>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Đang Tải...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h3>Chưa Có Lịch Đặt Sân</h3>
          <p>Hãy Đặt Sân Ngay Để Bắt Đầu</p>
          <Link className="btn btn-primary" to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quản Lý Sân" : "Đặt Sân Ngay"}
          </Link>
        </div>
      ) : (
        <section className="bookings-list">
          <h2 className="section-title">
            {role === "owner" ? `Tổng Cộng: ${bookings.length} Lịch Đặt` : `Lịch Sử Đặt Sân (${bookings.length})`}
          </h2>

          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-field">
                    <h3 className="field-name">{booking.fieldId?.name || "Không Rõ"}</h3>
                    <span className="field-type">{booking.fieldId?.type || "N/A"}</span>
                  </div>
                  <div className="booking-price">
                    {booking.fieldId?.price?.toLocaleString("vi-VN")} d
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Ngày Sử Dụng</span>
                    <span className="detail-value">
                      {booking.date ? new Date(booking.date + "T00:00:00").toLocaleDateString("vi-VN") : "N/A"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Khung Giờ</span>
                    <span className="detail-value">{booking.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày Đặt</span>
                    <span className="detail-value">
                      {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng Thái</span>
                    <span 
                      className="detail-value" 
                      style={{
                        fontWeight: 600,
                        color: booking.status === "pending" ? "#F59E0B" : 
                               booking.status === "approved" ? "#10B981" : "#EF4444"
                      }}
                    >
                      {booking.status === "pending" ? "Chờ Xác Nhận" :
                       booking.status === "approved" ? "Đã Xác Nhận" : "Đã Từ Chối"}
                    </span>
                  </div>
                  {role === "owner" && (
                    <div className="detail-item">
                      <span className="detail-label">Khách Hàng</span>
                      <span className="detail-value">{booking.customerId?.name || "N/A"}</span>
                    </div>
                  )}
                </div>

                {role === "customer" && (
                  <button
                    className={`btn btn-small booking-cancel ${booking.status === "pending" ? "btn-danger" : ""}`}
                    onClick={() => handleCancel(booking._id)}
                    disabled={booking.status !== "pending"}
                    style={{
                      opacity: booking.status !== "pending" ? 0.6 : 1,
                      cursor: booking.status !== "pending" ? "not-allowed" : "pointer"
                    }}
                  >
                    {booking.status === "pending" ? "Hủy Đặt Sân" : "Đã Đặt"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default BookingHistory;
