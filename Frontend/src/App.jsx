// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BuatReservasi from "./pages/BuatReservasi";
import DetailReservasi from "./pages/DetailReservasi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/buat-reservasi" element={<BuatReservasi />} />
        <Route path="/reservasi/:id" element={<DetailReservasi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
