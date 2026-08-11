import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Catalog from "../pages/Catalog.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import Cart from "../pages/Cart.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Catalog />} />
          <Route path="carrito" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
