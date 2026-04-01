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
  const [selectedDate, setSelectedDate] = useState(null);
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
    setSelectedDate(null);
    setSlotStatuses({});
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (!selectedField || !date) return;
    await checkSlotAvailability(selectedField._id, date);
  };

  const checkSlotAvailability = async (fieldId, date) => {
    try {
      setLoadingSlots(true);

      // API check xem những slot nào đã được đặt
      const res = await axios.get(
        `http://localhost:5000/api/booking/check-availability/${fieldId}/${date}`
      );

      // Tạo object ghi nhớ trạng thái của mỗi slot
      const statusMap = {};
      const bookedTimes = res.data.bookedTimes || [];
      TIME_SLOTS.forEach(slot => {
        statusMap[slot.time] = bookedTimes.includes(slot.time) ? "booked" : "available";
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
    if (!selectedDate) {
      alert("Vui lòng chọn ngày trước!");
      return;
    }

    // Lưu thông tin booking tạm thời
    const bookingData = {
      fieldId: selectedField._id,
      fieldName: selectedField.name,
      fieldPrice: selectedField.price,
      date: selectedDate,
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
            {role === "owner" ? "Dashboard" : "Trang Chủ"}
          </Link>
          <Link to="/customer/history">Lịch Sử Đặt Sân</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng Xuất
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
        <section className="booking-section">
          <h2>Chọn Sân Bóng ({fields.length} sân)</h2>
          <div className="fields-grid">
            {fields.map((field) => (
              <div
                key={field._id}
                className="field-card-compact"
                onClick={() => handleSelectField(field)}
              >
                <div className="field-image-compact">
                  {field.image ? (
                    <img src={field.image} alt={field.name} />
                  ) : (
                    "[No image]"
                  )}
                </div>
                <div className="field-info-compact">
                  <div className="field-name-compact">{field.name}</div>
                  <div className="field-type-compact">{field.type}</div>
                  <div className="field-price-compact">
                    {field.price?.toLocaleString("vi-VN")} đ
                  </div>
                </div>
              </div>
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

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>
                  Chọn Ngày *
                </label>
                <input
                  type="date"
                  value={selectedDate || ""}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {!selectedDate ? (
                <div style={{ textAlign: "center", color: "#9CA3AF", padding: "20px" }}>
                  Vui lòng chọn ngày để xem khung giờ
                </div>
              ) : loadingSlots ? (
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
          </div>
        </div>
      )}
    </main>
  );
}

export default Booking;