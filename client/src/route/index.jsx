import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import SearchPage from "../components/SearchPage";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import VerifyOTP from "../components/VerifyOTP";
import ResetPassword from "../components/ResetPassword";
import Dashboard from "../layouts/Dashboard";
import Profile from "../components/Profile";
import SavedAddresses from "../components/SavedAddresses";
import MyOrders from "../components/MyOrders";
import UploadProduct from "../components/UploadProduct";
import Category from "../components/Category";
import SubCategory from "../components/SubCategory";
import ProductAdmin from "../components/ProductAdmin";
import AdminPermission from "../layouts/AdminPermission";
import ProtectedRoute from "../layouts/ProtectedRoute";
import ProductList from "../components/ProductList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTP />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "products",
            element: (
              <AdminPermission>
                <ProductAdmin />
              </AdminPermission>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminPermission>
                <UploadProduct />
              </AdminPermission>
            ),
          },
          {
            path: "category",
            element: (
              <AdminPermission>
                <Category />
              </AdminPermission>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminPermission>
                <SubCategory />
              </AdminPermission>
            ),
          },
          {
            path: "my-orders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <SavedAddresses />,
          },
        ],
      },
      {
        path: "category/:categoryName",
        element: <ProductList />,
      },
      {
        path: "category/:categoryName/:subcategoryName",
        element: <ProductList />,
      },
    ],
  },
]);

export default router;
