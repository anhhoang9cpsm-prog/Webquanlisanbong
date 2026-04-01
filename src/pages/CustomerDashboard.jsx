import { Link } from "react-router-dom";

function CustomerDashboard() {
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

			<section className="dashboard-grid" style={{ maxWidth: "600px", margin: "0 auto" }}>
				<article className="stat-card">

					<div className="stat-label">Dat San Ngay</div>
					<div className="stat-value" style={{ color: "#3B82F6", fontSize: "18px" }}>
						Dat San
					</div>
					<Link className="btn btn-primary btn-small" to="/customer/booking" style={{ marginTop: "12px" }}>
						Tim San
					</Link>
				</article>

				<article className="stat-card">

				<div className="stat-label">Lịch Sử Đặt Sân</div>
				<div className="stat-value" style={{ color: "#10B981", fontSize: "18px" }}>
					Xem Chi Tiết
				</div>
				<Link className="btn btn-outline btn-small" to="/customer/history" style={{ marginTop: "12px" }}>
					Lịch Sử
					</Link>
				</article>
			</section>
		</main>
	);
}

export default CustomerDashboard;
