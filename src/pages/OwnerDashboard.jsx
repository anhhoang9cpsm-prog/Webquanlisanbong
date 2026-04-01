import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function OwnerDashboard() {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		pending: 0,
		totalFields: 0,
		totalApproved: 0,
		totalRejected: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (!token || role !== "owner") {
			navigate("/");
			return;
		}
		fetchStats();
	}, [navigate]);

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem("token");

			// Fetch booking requests
			const bookingsRes = await axios.get(
				"http://localhost:5000/api/booking-requests",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const bookings = Array.isArray(bookingsRes.data)
				? bookingsRes.data
				: bookingsRes.data.bookings || [];

			// Fetch fields
			const fieldsRes = await axios.get("http://localhost:5000/api/fields");
			const fields = Array.isArray(fieldsRes.data) ? fieldsRes.data : [];

			const pendingCount = bookings.filter((b) => b.status === "pending").length;
			const approvedCount = bookings.filter((b) => b.status === "approved").length;
			const rejectedCount = bookings.filter(
				(b) => b.status === "rejected"
			).length;

			setStats({
				pending: pendingCount,
				totalFields: fields.length,
				totalApproved: approvedCount,
				totalRejected: rejectedCount,
			});
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="page">
			<header className="topbar">
				<strong>Trang Quản Lý</strong>
				<nav className="navbar">
					<Link to="/owner">Dashboard</Link>
					<Link to="/owner/fields">Quản Lý Sân</Link>
					<Link to="/owner/requests">Quản Lý Đặt Sân</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Đăng Xuất</Link>
				</nav>
			</header>

			<section className="dashboard-grid">
				<article className="stat-card">
					<div className="stat-label">Yêu Cầu Chờ Duyệt</div>
					<div className="stat-value" style={{ color: "#F59E0B" }}>
						{loading ? "-" : stats.pending}
					</div>
					<Link
						className="btn btn-primary btn-small"
						to="/owner/requests"
					>
						Xem Chi Tiết
					</Link>
				</article>

				<article className="stat-card">
					<div className="stat-label">Tổng Số Sân</div>
					<div className="stat-value" style={{ color: "#3B82F6" }}>
						{loading ? "-" : stats.totalFields}
					</div>
				</article>

				<article className="stat-card">
					<div className="stat-label">Yêu Cầu Đã Duyệt</div>
					<div className="stat-value" style={{ color: "#10B981" }}>
						{loading ? "-" : stats.totalApproved}
					</div>
				</article>

				<article className="stat-card">
					<div className="stat-label">Yêu Cầu Bị Từ Chối</div>
					<div className="stat-value" style={{ color: "#EF4444" }}>
						{loading ? "-" : stats.totalRejected}
					</div>
				</article>
			</section>
		</main>
	);
}

export default OwnerDashboard;
