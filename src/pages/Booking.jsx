import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchFields();
  }, [navigate]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/fields");
      setFields(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sân");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (fieldId) => {
    if (!time.trim()) {
      alert("Vui lòng nhập khung giờ");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      setBookingId(fieldId);

      const res = await axios.post(
        "http://localhost:5000/api/booking",
        { fieldId, time },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Đặt sân thành công! ✓");
      setTime("");
      setBookingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Đặt sân thất bại");
      setBookingId(null);
    }
  };

  const role = localStorage.getItem("role");

  return (
    <main className="page">
      <header className="topbar">
        <strong>Đặt Sân Bóng</strong>
        <nav className="navbar">
          <Link to={role === "owner" ? "/owner" : "/customer"}>
            {role === "owner" ? "Dashboard" : "Trang chủ"}
          </Link>
          <Link to="/customer/history">Lịch sử đặt sân</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng xuất
          </Link>
        </nav>
      </header>

      <section className="booking-container">
        <div className="booking-filter">
          <h2>Chọn khung giờ đặt sân</h2>
          <div className="time-input-group">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="time-input"
              placeholder="Chọn giờ"
            />
            <span className="time-hint">Định dạng: HH:MM</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải danh sách sân...</div>
        ) : fields.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có sân nào</h3>
            <p>Vui lòng quay lại sau</p>
          </div>
        ) : (
          <section className="fields-grid">
            <h3>Danh sách sân bóng ({fields.length})</h3>
            <div className="grid">
              {fields.map((field) => (
                <article key={field._id} className="field-card col-4">
                  {field.image && (
                    <div className="field-image">
                      <img src={field.image} alt={field.name} />
                    </div>
                  )}
                  <div className="field-info">
                    <h3 className="field-name">{field.name}</h3>
                    <p className="field-type">{field.type}</p>
                    <p className="field-price">
                      {field.price?.toLocaleString("vi-VN")} đ / giờ
                    </p>

                    {time && (
                      <p className="selected-time">
                        ✓ Giờ chọn: <strong>{time}</strong>
                      </p>
                    )}

                    <button
                      className={`btn btn-primary btn-block ${
                        bookingId === field._id ? "loading" : ""
                      }`}
                      onClick={() => handleBooking(field._id)}
                      disabled={!time || bookingId === field._id}
                    >
                      {bookingId === field._id ? "Đang xử lý..." : "Đặt sân"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default Booking;