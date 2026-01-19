import React, { useEffect, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import toast from "react-hot-toast";
import ConfirmBox from "./ConfirmBox";

function ProductAdmin() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await CustomAxios({
        ...AxiosApi.get_products,
      });

      if (response.data.success) {
        setProductData(response.data.products || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await CustomAxios({
        ...AxiosApi.delete_product,
        url: AxiosApi.delete_product.url.replace(":id", deleteId),
      });

      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
        setOpenConfirmBoxDelete(false);
        setDeleteId("");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || !discount || discount <= 0) return price || 0;
    return price - (price * discount) / 100;
  };

  const filteredProducts = productData.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="h-full bg-neutral-50/50">
      <div className="px-6 py-5 bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-2xl text-neutral-800 mb-1">Products</h2>
            <p className="text-sm text-neutral-500">
              Manage and view all your products ({filteredProducts.length})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 min-w-[280px]">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl" />
              <input
                type="text"
                placeholder="Search product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm outline-none"
              />
            </div>
            <button
              onClick={() => fetchProducts()}
              className="text-sm bg-primary-500 hover:bg-primary-600 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 active:scale-95 flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 py-12">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-neutral-600 font-semibold animate-pulse text-lg">
              Fetching products...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => {
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discount,
              );

              let mainImage = "/no_data.png";
              if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                mainImage = product.images[0];
              } else if (product.image) {
                if (Array.isArray(product.image) && product.image.length > 0) {
                  mainImage = product.image[0];
                } else if (typeof product.image === 'string') {
                  mainImage = product.image;
                }
              }

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm border border-neutral-200 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Product Image Container */}
                  <div className="relative w-full h-48 bg-neutral-50 overflow-hidden p-4">
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
                        {product.discount}% OFF
                      </div>
                    )}
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/no_data.png";
                      }}
                    />
                  </div>

                  {/* Product Content */}
                  <div className="flex flex-col flex-1 p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    {/* Stock & Unit */}
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className={`${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} In Stock` : "Out of Stock"}
                      </span>
                      <span className="text-neutral-400">{product.unit}</span>
                    </div>

                    {/* Categories */}
                    {(product.category?.length > 0 || product.sub_category?.length > 0) && (
                      <div className="flex flex-wrap gap-1">
                        {product.category?.slice(0, 2).map((cat) => (
                          <span key={cat._id || cat} className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold">
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="pt-2 border-t border-neutral-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-neutral-800">
                          ₹{discountedPrice.toFixed(0)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[10px] text-neutral-400 line-through">
                            ₹{product.price?.toFixed(0)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setDeleteId(product._id);
                          setOpenConfirmBoxDelete(true);
                        }}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        title="Delete Product"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-3xl border-2 border-dashed border-neutral-200">
            <div className="w-48 h-48 mb-6 opacity-40">
              <img src="/no_data.png" alt="No Data" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">
              {searchTerm ? "No Results Found" : "No Products Found"}
            </h3>
            <p className="text-neutral-500 max-w-sm">
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}". Try a different name.`
                : "There are no products available at the moment. Start by uploading your first product!"
              }
            </p>
          </div>
        )}
      </div>

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
        />
      )}
    </section>
  );
}

export default ProductAdmin;
