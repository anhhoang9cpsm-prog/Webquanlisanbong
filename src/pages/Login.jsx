import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate("/dashboard");
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
