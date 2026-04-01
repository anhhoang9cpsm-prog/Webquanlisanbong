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
        : "http://localhost:5000/api/customer/bookings";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Khong the tai lich su dat san");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Ban chac chan muon huy dat san nay?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Huy dat san thanh cong");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Huy dat san that bai");
    }
  };

  const role = localStorage.getItem("role");

  return (
    <main className="page">
      <header className="topbar">
        <strong>
          {role === "owner" ? "Lich Dat San" : "Lich Su Dat San"}
        </strong>
        <nav className="navbar">
          <Link to={role === "owner" ? "/owner" : "/customer"}>
            {role === "owner" ? "Dashboard" : "Trang chu"}
          </Link>
          <Link to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quan ly san" : "Dat san"}
          </Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Dang xuat
          </Link>
        </nav>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Dang tai...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h3>Chua co lich dat san</h3>
          <p>Hay dat san ngay de bat dau</p>
          <Link className="btn btn-primary" to={role === "owner" ? "/owner/fields" : "/customer/booking"}>
            {role === "owner" ? "Quan ly san" : "Dat san ngay"}
          </Link>
        </div>
      ) : (
        <section className="bookings-list">
          <h2 className="section-title">
            {role === "owner" ? `Tong cong: ${bookings.length} lich dat` : `Lich su dat san (${bookings.length})`}
          </h2>

          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-field">
                    <h3 className="field-name">{booking.fieldId?.name || "Khong ro"}</h3>
                    <span className="field-type">{booking.fieldId?.type || "N/A"}</span>
                  </div>
                  <div className="booking-price">
                    {booking.fieldId?.price?.toLocaleString("vi-VN")} d
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="detail-label">Khung gio</span>
                    <span className="detail-value">{booking.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngay dat</span>
                    <span className="detail-value">
                      {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {role === "owner" && (
                    <div className="detail-item">
                      <span className="detail-label">Khach hang</span>
                      <span className="detail-value">{booking.userId || "N/A"}</span>
                    </div>
                  )}
                </div>

                {role === "customer" && (
                  <button
                    className="btn btn-danger btn-small booking-cancel"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Huy dat san
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
