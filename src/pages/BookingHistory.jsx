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

      // Owner xem tất cả booking, Customer xem booking của mình
      const endpoint = role === "owner" 
        ? "http://localhost:5000/api/booking"
        : "http://localhost:5000/api/customer/bookings";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải lịch sử đặt sân");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đặt sân này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Hủy đặt sân thành công");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Hủy đặt sân thất bại");
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
            {role === "owner" ? "Dashboard" : "Trang chủ"}
          </Link>
          <Link to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quản lý sân" : "Đặt sân"}
          </Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng xuất
          </Link>
        </nav>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h3>Chưa có lịch đặt sân</h3>
          <p>Hãy đặt sân ngay để bắt đầu</p>
          <Link className="btn btn-primary" to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quản lý sân" : "Đặt sân ngay"}
          </Link>
        </div>
      ) : (
        <section className="bookings-list">
          <h2>
            {role === "owner" ? `Tổng cộng: ${bookings.length} lịch đặt` : `Lịch sử đặt sân (${bookings.length})`}
          </h2>

          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  {role === "owner" && <th>Khách hàng</th>}
                  <th>Sân</th>
                  <th>Loại sân</th>
                  <th>Giá</th>
                  <th>Khung giờ</th>
                  <th>Ngày đặt</th>
                  {role === "customer" && <th>Hành động</th>}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    {role === "owner" && (
                      <td>{booking.userId || "N/A"}</td>
                    )}
                    <td className="field-name">
                      {booking.fieldId?.name || "Không rõ"}
                    </td>
                    <td className="field-type">
                      {booking.fieldId?.type || "N/A"}
                    </td>
                    <td className="field-price">
                      {booking.fieldId?.price?.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="booking-time">{booking.time}</td>
                    <td className="booking-date">
                      {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    {role === "customer" && (
                      <td>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Hủy
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default BookingHistory;
