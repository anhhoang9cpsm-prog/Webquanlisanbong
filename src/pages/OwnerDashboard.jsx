import { Link } from "react-router-dom";

function OwnerDashboard() {
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
				<div className="stat-value" style={{ color: "#F59E0B" }}>12</div>
				<Link className="btn btn-primary btn-small" to="/owner/requests">
					Xem Chi Tiết
					</Link>
				</article>

				<article className="stat-card">

				<div className="stat-label">Tổng Số Sân</div>
					<div className="stat-value" style={{ color: "#3B82F6" }}>8</div>
				</article>

				<article className="stat-card">

					<div className="stat-label">Doanh Thu Tháng</div>
					<div className="stat-value" style={{ color: "#10B981" }}>12.5tr</div>
				</article>

				<article className="stat-card">

					<div className="stat-label">Tổng Đơn Hàng</div>
					<div className="stat-value" style={{ color: "#8B5CF6" }}>156</div>
				</article>
			</section>
		</main>
	);
}

export default OwnerDashboard;
