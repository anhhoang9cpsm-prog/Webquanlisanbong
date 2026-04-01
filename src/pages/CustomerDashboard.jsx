import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerDashboard() {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalBookings: 0,
		pendingBookings: 0,
		approvedBookings: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (!token || role !== "customer") {
			navigate("/");
			return;
		}
		fetchStats();
	}, [navigate]);

	const fetchStats = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get("http://localhost:5000/api/customer/bookings", {
				headers: { Authorization: `Bearer ${token}` },
			});

			const bookings = Array.isArray(res.data) ? res.data : res.data.bookings || [];
			const pending = bookings.filter((b) => b.status === "pending").length;
			const approved = bookings.filter((b) => b.status === "approved").length;

			setStats({
				totalBookings: bookings.length,
				pendingBookings: pending,
				approvedBookings: approved,
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
				<strong>Trang Khách Hàng</strong>
				<nav className="navbar">
					<Link to="/customer">Trang Chủ</Link>
					<Link to="/customer/booking">Đặt Sân</Link>
					<Link to="/customer/history">Lịch Sử Đặt Sân</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Đăng Xuất</Link>
				</nav>
			</header>

			<section className="dashboard-grid">
				<article className="stat-card">
					<div className="stat-label">Tổng Đặt Sân</div>
					<div className="stat-value" style={{ color: "#3B82F6" }}>
						{loading ? "-" : stats.totalBookings}
					</div>
					<Link
						className="btn btn-primary btn-small"
						to="/customer/booking"
					>
						Đặt Sân Ngay
					</Link>
				</article>

				<article className="stat-card">
					<div className="stat-label">Chờ Xác Nhận</div>
					<div className="stat-value" style={{ color: "#F59E0B" }}>
						{loading ? "-" : stats.pendingBookings}
					</div>
				</article>

				<article className="stat-card">
					<div className="stat-label">Đã Duyệt</div>
					<div className="stat-value" style={{ color: "#10B981" }}>
						{loading ? "-" : stats.approvedBookings}
					</div>
					<Link
						className="btn btn-outline btn-small"
						to="/customer/history"
					>
						Lịch Sử
					</Link>
				</article>
			</section>
		</main>
	);
}

export default CustomerDashboard;
