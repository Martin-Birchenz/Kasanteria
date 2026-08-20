import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Catalog from "../pages/Catalog.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import Cart from "../pages/Cart.jsx";
import { Login } from "../pages/admin/Login.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { AdminDashboard } from "../pages/admin/AdminDashboard.jsx";
import { ProductDetail } from "../pages/ProductDetail.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Catalog />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="productos/:id" element={<ProductDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
