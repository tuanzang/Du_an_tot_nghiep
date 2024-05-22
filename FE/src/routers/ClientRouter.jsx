import { createRoute } from "react-router-dom";
import Home from "../layout/client/Home";
import Product from "../layout/client/Product";

const ClientRouter = createRoute([
  {
    path: "/home",
    element: <Home />,
    index: true,
    loader: () => {
      document.title = "F-Shoes - Sản phẩm";
      return null;
    },
  },
  {
    path: "/product",
    element: <Product />,
    loader: () => {
      document.title = "F-Shoes - Sản phẩm";
      return null;
    },
  },
]);

export default ClientRouter;
