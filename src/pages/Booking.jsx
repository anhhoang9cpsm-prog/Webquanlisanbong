import { useEffect, useState } from "react";
import axios from "axios";

function Booking() {
  const [fields, setFields] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/fields")
      .then(res => setFields(res.data));
  }, []);

  const handleBooking = async (fieldId) => {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/booking",
      { fieldId, time },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Đặt sân thành công");
  };

  return (
    <div>
      <h1>Đặt sân</h1>

      <input
        placeholder="Nhập giờ (VD: 18:00)"
        onChange={(e) => setTime(e.target.value)}
      />

      {fields.map(field => (
        <div key={field._id}>
          <h3>{field.name}</h3>
          <p>{field.type} - {field.price} VND</p>

          <button onClick={() => handleBooking(field._id)}>
            Đặt sân
          </button>
        </div>
      ))}
    </div>
  );
}

export default Booking;