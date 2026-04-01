import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Time slots từ 7h đến 23h
const TIME_SLOTS = [
  "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00",
];

function Fields() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchFields();
  }, [navigate]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/fields");
      setFields(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sân");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (field = null) => {
    if (field) {
      setEditingField(field);
      setFormData({
        name: field.name,
        type: field.type,
        price: field.price,
        image: field.image || "",
      });
    } else {
      setEditingField(null);
      setFormData({
        name: "",
        type: "",
        price: "",
        image: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingField(null);
    setFormData({
      name: "",
      type: "",
      price: "",
      image: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editingField) {
        // Edit field
        await axios.put(
          `http://localhost:5000/api/fields/${editingField._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✓ Cập nhật sân thành công");
      } else {
        // Add field
        await axios.post(
          "http://localhost:5000/api/fields",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✓ Thêm sân thành công");
      }

      fetchFields();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDelete = async (fieldId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá sân này?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✓ Xoá sân thành công");
      fetchFields();
    } catch (err) {
      console.error(err);
      alert("Xoá sân thất bại");
    }
  };

  return (
    <main className="page">
      <header className="topbar">
        <strong>Quản Lý Sân Bóng</strong>
        <nav className="navbar">
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/requests">Quản Lý Đặt Sân</Link>
          <Link to="/" onClick={() => localStorage.clear()}>
            Đăng Xuất
          </Link>
        </nav>
      </header>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{ margin: 0 }}>Danh Sách Sân Bóng ({fields.length})</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Thêm Sân Mới
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải danh sách sân...</div>
        ) : fields.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có sân nào</h3>
            <p>Hãy thêm sân để bắt đầu</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              Thêm Sân Mới
            </button>
          </div>
        ) : (
          <div className="fields-table-container">
            <table className="fields-table">
              <thead>
                <tr>
                  <th>Tên Sân</th>
                  <th>Loại Sân</th>
                  <th>Giá / 2h</th>
                  <th>Ảnh</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field._id}>
                    <td className="field-name">
                      <strong>{field.name}</strong>
                    </td>
                    <td className="field-type">
                      <span className="type-badge">{field.type}</span>
                    </td>
                    <td className="field-price">
                      <strong>{field.price?.toLocaleString("vi-VN")} đ</strong>
                    </td>
                    <td className="field-image">
                      {field.image ? (
                        <img src={field.image} alt={field.name} />
                      ) : (
                        <span className="no-image">-</span>
                      )}
                    </td>
                    <td className="field-actions">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleOpenModal(field)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDelete(field._id)}
                        title="Xoá"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL THÊM / SỬA SÂN */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingField ? "Sửa Thông Tin Sân" : "Thêm Sân Mới"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên Sân *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Sân Bóng A, Sân 1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại Sân *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn loại sân --</option>
                  <option value="5v5">5 vs 5</option>
                  <option value="7v7">7 vs 7</option>
                  <option value="11v11">11 vs 11</option>
                  <option value="Futsal">Futsal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá / 2 Tiếng (VND) *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="VD: 100000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Link Ảnh Sân</label>
                <input
                  id="image"
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingField ? "Cập Nhật" : "Thêm Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Fields;