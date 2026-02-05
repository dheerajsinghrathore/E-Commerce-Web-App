export const baseURL = "http://localhost:8080";

const AxiosApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  verify_otp_password: {
    url: "/api/user/verify-otp",
    method: "put",
  },
  reset_password: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refresh_token: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  user_details: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  upload_avatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  update_user: {
    url: "/api/user/update-user",
    method: "put",
  },
  add_category: {
    url: "/api/category/add-category",
    method: "post",
  },
  upload_image: {
    url: "/api/upload/upload-image",
    method: "post",
  },
  get_categories: {
    url: "/api/category/get-category",
    method: "get",
  },
  update_category: {
    url: "/api/category/update-category",
    method: "put",
  },
  delete_category: {
    url: "/api/category/delete-category",
    method: "delete",
  },
  create_subcategory: {
    url: "/api/subcategory/create",
    method: "post",
  },
  get_subcategory: {
    url: "/api/subcategory/get",
    method: "get",
  },
  update_subcategory: {
    url: "/api/subcategory/update/:id",
    method: "put",
  },
  delete_subcategory: {
    url: "/api/subcategory/delete/:id",
    method: "delete",
  },
  create_product: {
    url: "/api/product/create",
    method: "post",
  },
  get_products: {
    url: "/api/product/get-products",
    method: "get",
  },
  get_product_by_id: {
    url: "/api/product/get-product/:id",
    method: "get",
  },
  get_products_by_category: {
    url: "/api/product/get-products-by-category",
    method: "post",
  },
  delete_product: {
    url: "/api/product/delete/:id",
    method: "delete",
  },
};

export default AxiosApi;
