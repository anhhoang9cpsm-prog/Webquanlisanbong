import { Link } from "react-router-dom";

function Fields() {
	return (
		<main className="page">
			<header className="topbar">
				<div>
					<strong>Quản lý sân bóng</strong>
				</div>
				<nav className="topbar-links">
					<Link to="/dashboard">Dashboard</Link>
					<Link to="/fields">Sân bóng</Link>
					<Link to="/booking">Đặt sân</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-6">
					<h3>Sân mini A</h3>
					<p className="muted">Sức chứa 10 người • Cỏ nhân tạo mới.</p>
					<div className="actions">
						<span className="status status-open">Còn trống</span>
					</div>
				</article>

				<article className="card col-6">
					<h3>Sân 7 người B</h3>
					<p className="muted">Khu vực có mái che • Đèn LED đầy đủ.</p>
					<div className="actions">
						<span className="status status-busy">Đã đặt nhiều</span>
					</div>
				</article>

				<article className="card col-12">
					<h3>Bảng trạng thái sân</h3>
					<table className="table">
						<thead>
							<tr>
								<th>Tên sân</th>
								<th>Khung giờ trống</th>
								<th>Giá / giờ</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Sân mini A</td>
								<td>08:00 - 16:00</td>
								<td>300.000đ</td>
							</tr>
							<tr>
								<td>Sân 7 người B</td>
								<td>09:00 - 14:00</td>
								<td>450.000đ</td>
							</tr>
						</tbody>
					</table>
					<div className="actions">
						<Link className="btn btn-primary" to="/booking">
							Tạo lịch đặt
						</Link>
					</div>
				</article>
			</section>
		</main>
	);
}

export default Fields;
