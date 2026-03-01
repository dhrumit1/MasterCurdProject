import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Orders from "../pages/Orders";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}

export default AppRoutes;
