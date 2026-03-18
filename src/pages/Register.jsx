import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="title">Tạo tài khoản</h1>
        <p className="subtitle">Đăng ký để bắt đầu quản lý sân bóng của bạn.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">
            Họ và tên
            <input id="fullName" name="fullName" placeholder="Nguyễn Văn A" required />
          </label>

          <label htmlFor="email">
            Email
            <input id="email" name="email" type="email" placeholder="admin@sanbong.vn" required />
          </label>

          <label htmlFor="password">
            Mật khẩu
            <input id="password" name="password" type="password" placeholder="••••••••" required />
          </label>

          <button className="btn btn-primary" type="submit">
            Đăng ký tài khoản
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/">Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
