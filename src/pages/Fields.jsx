import { useState } from "react";
import axios from "axios";

function Fields() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/fields",
      { name, type, price, image },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Thêm sân thành công");
  };

  return (
    <div>
      <h1>Thêm sân</h1>

      <input placeholder="Tên sân" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Loại sân" onChange={(e) => setType(e.target.value)} />
      <input placeholder="Giá" onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Link ảnh" onChange={(e) => setImage(e.target.value)} />

      <button onClick={handleAdd}>Thêm</button>
    </div>
  );
}

export default Fields;