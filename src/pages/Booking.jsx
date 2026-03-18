import { Link } from "react-router-dom";

function Booking() {
	return (
		<main className="page">
			<header className="topbar">
				<div>
					<strong>Quản lý lịch đặt sân</strong>
				</div>
				<nav className="topbar-links">
					<Link to="/dashboard">Dashboard</Link>
					<Link to="/fields">Sân bóng</Link>
					<Link to="/booking">Đặt sân</Link>
				</nav>
			</header>

			<section className="grid">
				<article className="card col-6">
					<h3>Tạo lịch đặt mới</h3>
					<form className="form">
						<label htmlFor="fieldName">
							Sân
							<select id="fieldName" name="fieldName" defaultValue="mini-a">
								<option value="mini-a">Sân mini A</option>
								<option value="seven-b">Sân 7 người B</option>
							</select>
						</label>

						<label htmlFor="date">Ngày</label>
						<input id="date" type="date" />

						<label htmlFor="time">Khung giờ</label>
						<input id="time" type="time" />

						<button className="btn btn-primary" type="button">
							Lưu lịch đặt
						</button>
					</form>
				</article>

				<article className="card col-6">
					<h3>Ghi chú vận hành</h3>
					<p className="muted">Xác nhận cọc trước khi giữ sân vào khung giờ cao điểm.</p>
					<div className="actions">
						<span className="status status-open">Sẵn sàng nhận lịch</span>
					</div>
				</article>

				<article className="card col-12">
					<h3>Lịch gần đây</h3>
					<table className="table">
						<thead>
							<tr>
								<th>Khách hàng</th>
								<th>Sân</th>
								<th>Giờ</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Nguyễn Minh</td>
								<td>Sân mini A</td>
								<td>19:00 - 20:30</td>
							</tr>
							<tr>
								<td>Hoàng Long</td>
								<td>Sân 7 người B</td>
								<td>17:30 - 19:00</td>
							</tr>
						</tbody>
					</table>
				</article>
			</section>
		</main>
	);
}

export default Booking;
