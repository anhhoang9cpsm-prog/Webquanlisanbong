import { Link } from "react-router-dom";

function Dashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<div>
					<strong>Web Quản Lý Sân Bóng</strong>
				</div>
				<nav className="topbar-links">
					<Link to="/dashboard">Dashboard</Link>
					<Link to="/fields">Sân bóng</Link>
					<Link to="/booking">Đặt sân</Link>
					<Link to="/">Đăng xuất</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-4">
					<h3>Tổng số sân</h3>
					<div className="value">12</div>
					<p className="muted">Đang hoạt động ổn định.</p>
				</article>

				<article className="card col-4">
					<h3>Lịch hôm nay</h3>
					<div className="value">26</div>
					<p className="muted">+4 so với hôm qua.</p>
				</article>

				<article className="card col-4">
					<h3>Doanh thu tạm tính</h3>
					<div className="value">8.5tr</div>
					<p className="muted">Cập nhật theo thời gian thực.</p>
				</article>

				<article className="card col-8">
					<h3>Khung giờ cao điểm</h3>
					<p className="muted">Tập trung nhiều lượt đặt nhất từ 18:00 - 21:00.</p>
					<div className="actions">
						<Link className="btn btn-primary" to="/booking">
							Xem lịch đặt
						</Link>
						<Link className="btn btn-outline" to="/fields">
							Quản lý sân
						</Link>
					</div>
				</article>

				<article className="card col-4">
					<h3>Trạng thái hệ thống</h3>
					<p className="muted">Máy chủ và API hoạt động bình thường.</p>
					<div className="actions">
						<span className="status status-open">Online</span>
					</div>
				</article>
			</section>
		</main>
	);
}

export default Dashboard;
