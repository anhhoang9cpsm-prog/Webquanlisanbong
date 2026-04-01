import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Time slots từ 7h đến 23h, mỗi slot 2 tiếng
const TIME_SLOTS = [
  { time: "07:00", label: "07:00 - 09:00" },
  { time: "09:00", label: "09:00 - 11:00" },
  { time: "11:00", label: "11:00 - 13:00" },
  { time: "13:00", label: "13:00 - 15:00" },
  { time: "15:00", label: "15:00 - 17:00" },
  { time: "17:00", label: "17:00 - 19:00" },
  { time: "19:00", label: "19:00 - 21:00" },
  { time: "21:00", label: "21:00 - 23:00" },
];

function Booking() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [slotStatuses, setSlotStatuses] = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);

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

  const handleSelectField = async (field) => {
    setSelectedField(field);
    await checkSlotAvailability(field._id);
  };

  const checkSlotAvailability = async (fieldId) => {
    try {
      setLoadingSlots(true);
      const token = localStorage.getItem("token");
      
      // API check xem những slot nào đã được đặt
      const res = await axios.get(
        `http://localhost:5000/api/booking/available/${fieldId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Tạo object ghi nhớ trạng thái của mỗi slot
      const statusMap = {};
      TIME_SLOTS.forEach(slot => {
        statusMap[slot.time] = res.data.includes(slot.time) ? "booked" : "available";
      });
      setSlotStatuses(statusMap);
    } catch (err) {
      console.error(err);
      // Nếu API không tồn tại, default tất cả là available
      const statusMap = {};
      TIME_SLOTS.forEach(slot => {
        statusMap[slot.time] = "available";
      });
      setSlotStatuses(statusMap);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectTime = (slot) => {
    if (slotStatuses[slot.time] === "booked") return;

    // Lưu thông tin booking tạm thời
    const bookingData = {
      fieldId: selectedField._id,
      fieldName: selectedField.name,
      fieldPrice: selectedField.price,
      time: slot.time,
      timeLabel: slot.label,
    };

    // Chuyển đến trang thanh toán
    navigate("/payment", { state: bookingData });
  };

  const handleCloseModal = () => {
    setSelectedField(null);
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
          <h2>Danh sách sân bóng ({fields.length})</h2>
          <div className="grid">
            {fields.map((field) => (
              <article
                key={field._id}
                className="field-card col-4 clickable"
                onClick={() => handleSelectField(field)}
              >
                {field.image && (
                  <div className="field-image">
                    <img src={field.image} alt={field.name} />
                  </div>
                )}
                <div className="field-info">
                  <h3 className="field-name">{field.name}</h3>
                  <p className="field-type">{field.type}</p>
                  <p className="field-price">
                    {field.price?.toLocaleString("vi-VN")} đ / 2 tiếng
                  </p>
                  <button className="btn btn-primary btn-block">
                    Chọn khung giờ
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* MODAL CHỌN KHUNG GIỜ */}
      {selectedField && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedField.name}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-subtitle">
                Giá: <strong>{selectedField.price?.toLocaleString("vi-VN")} đ</strong> / 2 tiếng
              </p>

              {loadingSlots ? (
                <div className="loading">Đang kiểm tra khung giờ...</div>
              ) : (
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      className={`time-slot ${slotStatuses[slot.time]}`}
                      onClick={() => handleSelectTime(slot)}
                      disabled={slotStatuses[slot.time] === "booked"}
                      title={
                        slotStatuses[slot.time] === "booked"
                          ? "Khung giờ này đã đặt"
                          : "Chọn khung giờ này"
                      }
                    >
                      <div className="slot-time">{slot.label}</div>
                      <div className="slot-status">
                        {slotStatuses[slot.time] === "booked" ? (
                          <>
                            <span className="status-badge booked">Đã đặt</span>
                          </>
                        ) : (
                          <>
                            <span className="status-badge available">Còn trống</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Booking;