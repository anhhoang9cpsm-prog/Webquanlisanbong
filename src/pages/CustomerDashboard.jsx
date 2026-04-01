import { Link } from "react-router-dom";

function CustomerDashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<strong>Customer Dashboard</strong>
				<nav className="navbar">
					<Link to="/customer">Trang chu</Link>
					<Link to="/customer/booking">Dat san</Link>
					<Link to="/customer/history">Lich su dat san</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Dang xuat</Link>
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

					<div className="stat-label">Lich Su Dat San</div>
					<div className="stat-value" style={{ color: "#10B981", fontSize: "18px" }}>
						Xem Chi Tiet
					</div>
					<Link className="btn btn-outline btn-small" to="/customer/history" style={{ marginTop: "12px" }}>
						Lich Su
					</Link>
				</article>
			</section>
		</main>
	);
}

export default CustomerDashboard;
