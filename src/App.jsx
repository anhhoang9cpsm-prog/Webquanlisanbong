import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Fields from "./pages/Fields.jsx";
import Booking from "./pages/Booking.jsx";
import BookingHistory from "./pages/BookingHistory.jsx";
import Payment from "./pages/Payment.jsx";
import ManageBookings from "./pages/ManageBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* OWNER */}
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/fields" element={<Fields />} />
        <Route path="/owner/booking" element={<Booking />} />
        <Route path="/owner/requests" element={<ManageBookings />} />
        <Route path="/owner/history" element={<BookingHistory />} />

        {/* CUSTOMER */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/booking" element={<Booking />} />
        <Route path="/customer/history" element={<BookingHistory />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<Payment />} />

        {/* BOOKING HISTORY - BOTH ROLES */}
        <Route path="/owner/history" element={<BookingHistory />} />

        {/* NOT FOUND */}
        <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;