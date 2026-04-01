import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ManageBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [actionInProgress, setActionInProgress] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "owner") {
      navigate("/");
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Lấy yêu cầu đặt sân
      const res = await axios.get("http://localhost:5000/api/booking-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allBookings = Array.isArray(res.data) ? res.data : res.data.bookings || [];
      setBookings(allBookings);

      // Tính thống kê
      const pendingCount = allBookings.filter((b) => b.status === "pending").length;
      const approvedCount = allBookings.filter((b) => b.status === "approved").length;
      const rejectedCount = allBookings.filter((b) => b.status === "rejected").length;

      setStats({
        total: allBookings.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách đặt sân");
      // Demo data nếu backend không có
      setBookings(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    return [
      {
        _id: "1",
        fieldId: { _id: "f1", name: "Sân Bóng A" },
        customerId: { _id: "c1", name: "Nguyễn Văn A", email: "nva@example.com" },
        time: "07:00 - 09:00",
        totalPrice: 200000,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "2",
        fieldId: { _id: "f2", name: "Sân Bóng B" },
        customerId: { _id: "c2", name: "Trần Thị B", email: "ttb@example.com" },
        time: "09:00 - 11:00",
        totalPrice: 250000,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "3",
        fieldId: { _id: "f1", name: "Sân Bóng A" },
        customerId: { _id: "c3", name: "Phạm Văn C", email: "pvc@example.com" },
        time: "15:00 - 17:00",
        totalPrice: 200000,
        status: "approved",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "4",
        fieldId: { _id: "f3", name: "Sân Bóng C" },
        customerId: { _id: "c4", name: "Lê Thị D", email: "ltd@example.com" },
        time: "19:00 - 21:00",
        totalPrice: 180000,
        status: "rejected",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  const handleApprove = async (bookingId) => {
    try {
      setActionInProgress(bookingId);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/booking-requests/${bookingId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✓ Duyệt yêu cầu thành công");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Duyệt yêu cầu thất bại");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      setActionInProgress(bookingId);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/booking-requests/${bookingId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✓ Từ chối yêu cầu thành công");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Từ chối yêu cầu thất bại");
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <main className="page">
      <header className="topbar">
        <strong>📋 Quản Lý Đặt Sân</strong>
        <nav className="navbar">
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/fields">Quản lý sân</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng xuất
          </Link>
        </nav>
      </header>

      <section className="bookings-management">
        {/* STATISTICS CARDS */}
        <div className="stats-grid">
          <div className={`stat-card ${filter === "all" ? "highlight" : ""}`} onClick={() => setFilter("all")}>
            <div className="stat-label">Tổng Số Đặt</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className={`stat-card highlight ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
            <div className="stat-label">Chờ Xác Nhận</div>
            <div className="stat-value" style={{ color: "#dd4157" }}>
              {stats.pending}
            </div>
          </div>
          <div className={`stat-card ${filter === "approved" ? "highlight" : ""}`} onClick={() => setFilter("approved")}>
            <div className="stat-label">Đã Duyệt</div>
            <div className="stat-value" style={{ color: "#23a26d" }}>
              {stats.approved}
            </div>
          </div>
          <div className={`stat-card ${filter === "rejected" ? "highlight" : ""}`} onClick={() => setFilter("rejected")}>
            <div className="stat-label">Đã Từ Chối</div>
            <div className="stat-value" style={{ color: "#5f6b85" }}>
              {stats.rejected}
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="filter-section">
          <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#5f6b85" }}>
            HIỂN THỊ
          </h3>
          <div className="filter-tabs">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tất Cả ({stats.total})
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              ⏳ Chờ Xác Nhận ({stats.pending})
            </button>
            <button
              className={`filter-btn ${filter === "approved" ? "active" : ""}`}
              onClick={() => setFilter("approved")}
            >
              ✓ Đã Duyệt ({stats.approved})
            </button>
            <button
              className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              ✕ Đã Từ Chối ({stats.rejected})
            </button>
          </div>
        </div>

        {/* LOADING / ERROR */}
        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div className="loading">Đang tải danh sách đặt sân...</div>}

        {/* BOOKINGS LIST */}
        {!loading && filteredBookings.length === 0 ? (
          <div className="empty-state">
            <h3>📭 Không có đặt sân</h3>
            <p>
              {filter === "pending" && "Không có yêu cầu chờ xác nhận"}
              {filter === "approved" && "Không có đặt sân đã duyệt"}
              {filter === "rejected" && "Không có đặt sân đã từ chối"}
              {filter === "all" && "Không có dữ liệu"}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`booking-card booking-status-${booking.status}`}
              >
                {/* HEADER */}
                <div className="booking-card-header">
                  <div className="booking-title">
                    <h3 className="booking-field-name">
                      ⚽ {booking.fieldId?.name || "Sân không xác định"}
                    </h3>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status === "pending" && "⏳ Chờ xác nhận"}
                      {booking.status === "approved" && "✓ Đã duyệt"}
                      {booking.status === "rejected" && "✕ Đã từ chối"}
                    </span>
                  </div>
                  <div className="booking-date">
                    {formatDate(booking.createdAt)}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="booking-details">
                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">👤 Khách hàng:</span>
                      <span className="detail-value">
                        {booking.customerId?.name || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📧 Email:</span>
                      <span className="detail-value">
                        {booking.customerId?.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="detail-group">
                    <div className="detail-item">
                      <span className="detail-label">🕐 Khung giờ:</span>
                      <span className="detail-value booking-time">
                        {booking.time}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">💰 Giá:</span>
                      <span className="detail-value price">
                        {booking.totalPrice?.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                {booking.status === "pending" && (
                  <div className="booking-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(booking._id)}
                      disabled={actionInProgress === booking._id}
                    >
                      {actionInProgress === booking._id ? (
                        <>
                          <span className="loading-spinner"></span> Đang xử lý...
                        </>
                      ) : (
                        "✓ Duyệt"
                      )}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(booking._id)}
                      disabled={actionInProgress === booking._id}
                    >
                      {actionInProgress === booking._id ? (
                        <>
                          <span className="loading-spinner"></span> Đang xử lý...
                        </>
                      ) : (
                        "✕ Từ chối"
                      )}
                    </button>
                  </div>
                )}

                {booking.status === "approved" && (
                  <div className="approval-info approved">
                    <strong>✓ Đã duyệt</strong> - Khách hàng có thể đén sân
                  </div>
                )}

                {booking.status === "rejected" && (
                  <div className="approval-info rejected">
                    <strong>✕ Đã từ chối</strong> - Khách hàng được thông báo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ManageBookings;
