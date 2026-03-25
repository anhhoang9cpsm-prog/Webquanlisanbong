import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/register", form);

      alert(res.data.message);

      if (res.data.message === "Đăng ký thành công!") {
        navigate("/"); // quay về login
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="title">Tạo tài khoản</h1>
        <p className="subtitle">Đăng ký để bắt đầu.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input
              name="username"
              placeholder="Nguyễn Văn A"
              required
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="admin@sanbong.vn"
              required
              onChange={handleChange}
            />
          </label>

          <label>
            Mật khẩu
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
            />
          </label>

          {/* 🔥 THÊM ROLE */}
          <label>
            Bạn là
            <select name="role" onChange={handleChange}>
              <option value="customer">Khách đặt sân</option>
              <option value="owner">Chủ sân</option>
            </select>
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