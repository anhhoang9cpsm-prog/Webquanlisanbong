import { Link } from "react-router-dom";

function OwnerDashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<strong>Trang Chủ Sân</strong>
				<nav>
					<Link to="/owner">Dashboard</Link>
					<Link to="/owner/fields">Quản lý sân</Link>
					<Link to="/owner/booking">Lịch đặt</Link>
					<Link to="/">Đăng xuất</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-4">
					<h3>Tổng số sân</h3>
					<div className="value">12</div>
				</article>

				<article className="card col-4">
					<h3>Lịch hôm nay</h3>
					<div className="value">26</div>
				</article>

				<article className="card col-4">
					<h3>Doanh thu</h3>
					<div className="value">8.5tr</div>
				</article>
			</section>
		</main>
	);
}

export default OwnerDashboard;