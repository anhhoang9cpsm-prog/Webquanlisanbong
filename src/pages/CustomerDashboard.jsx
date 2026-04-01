import { Link } from "react-router-dom";

function CustomerDashboard() {
	return (
		<main className="page">
			<header className="topbar">
				<strong>Trang Khách Hàng</strong>
				<nav className="navbar">
					<Link to="/customer">Trang chủ</Link>
					<Link to="/customer/booking">Đặt sân</Link>
					<Link to="/customer/history">Lịch sử đặt sân</Link>
					<Link to="/" onClick={() => localStorage.clear()}>Đăng xuất</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-6">
					<h3>Đặt sân ngay</h3>
					<p>Chọn sân và khung giờ phù hợp</p>
					<Link className="btn btn-primary" to="/customer/booking">
						Đặt sân
					</Link>
				</article>

				<article className="card col-6">
					<h3>Lịch đã đặt</h3>
					<p>Xem lại các lịch bạn đã đặt</p>
					<Link className="btn btn-outline" to="/customer/history">
						Xem lịch sử
					</Link>
				</article>
			</section>
		</main>
	);
}

export default CustomerDashboard;