import { Link } from "react-router-dom";

function OwnerDashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<strong>Admin Dashboard</strong>
				<nav className="navbar">
					<Link to="/owner">Dashboard</Link>
					<Link to="/owner/fields">Quan Ly San</Link>
					<Link to="/owner/requests">Quan Ly Dat San</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Dang Xuat</Link>
				</nav>
			</header>

			<section className="dashboard-grid">
				<article className="stat-card">

					<div className="stat-label">Yeu Cau Cho Duyet</div>
					<div className="stat-value" style={{ color: "#F59E0B" }}>12</div>
					<Link className="btn btn-primary btn-small" to="/owner/requests">
						Xem Chi Tiet
					</Link>
				</article>

				<article className="stat-card">

					<div className="stat-label">Tong So San</div>
					<div className="stat-value" style={{ color: "#3B82F6" }}>8</div>
				</article>

				<article className="stat-card">

					<div className="stat-label">Doanh Thu Thang</div>
					<div className="stat-value" style={{ color: "#10B981" }}>12.5tr</div>
				</article>

				<article className="stat-card">

					<div className="stat-label">Tong Don Hang</div>
					<div className="stat-value" style={{ color: "#8B5CF6" }}>156</div>
				</article>
			</section>
		</main>
	);
}

export default OwnerDashboard;
