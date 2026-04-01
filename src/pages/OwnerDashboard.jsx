import { Link } from "react-router-dom";

function OwnerDashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<strong>Trang Chủ Sân</strong>
				<nav className="navbar">
					<Link to="/owner">Dashboard</Link>
					<Link to="/owner/fields">Quản lý sân</Link>
					<Link to="/owner/requests">Quản lý đặt sân</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Đăng xuất</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-4">
					<h3>� Quản Lý Đặt Sân</h3>
					<div className="value" style={{ color: "#dd4157" }}>12</div>
					<Link className="btn btn-primary btn-small" to="/owner/requests">
						Xem chi tiết
					</Link>
				</article>

				<article className="card col-4">
					<h3>🎯 Tổng Sân</h3>
					<div className="value">8</div>
				</article>

				<article className="card col-4">
					<h3>📊 Doanh Thu</h3>
					<div className="value" style={{ color: "#23a26d" }}>12.5tr</div>
				</article>
			</section>
		</main>
	);
}

export default OwnerDashboard;