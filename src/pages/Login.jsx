import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		const email = event.target.email.value;
		const password = event.target.password.value;

		try {
			const res = await axios.post(
				"http://localhost:5000/api/login",
				{ email, password }
			);

			console.log(res.data.role);

			// lưu token + role
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("role", res.data.role);

			// phân quyền
			if (res.data.role === "owner") {
				navigate("/owner");
			} else {
				navigate("/customer");
			}

		} catch (err) {
			console.log(err);
			alert("Đăng nhập thất bại");
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-card">
				<h1 className="title">Đăng nhập hệ thống</h1>
				<p className="subtitle">Quản lý sân, lịch đặt và doanh thu nhanh chóng.</p>

				<form className="form" onSubmit={handleSubmit}>
					<label htmlFor="email">
						Email
						<input id="email" name="email" type="email" placeholder="admin@sanbong.vn" required />
					</label>

					<label htmlFor="password">
						Mật khẩu
						<input id="password" name="password" type="password" placeholder="••••••••" required />
					</label>

					<button className="btn btn-primary" type="submit">
						Đăng nhập
					</button>
				</form>

				<p className="auth-switch">
					Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
				</p>
			</section>
		</main>
	);
}

export default Login;