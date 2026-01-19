import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import toast from "react-hot-toast";

function ProductAdmin() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await CustomAxios({
        ...AxiosApi.delete_product,
        url: AxiosApi.delete_product.url.replace(":id", id),
      });

      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!price || !discount || discount <= 0) return price || 0;
    return price - (price * discount) / 100;
  };

  return (
    <section className="h-full bg-neutral-50/50">
      <div className="px-6 py-5 bg-white shadow-sm border-b flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-2xl text-neutral-800 mb-1">Products</h2>
          <p className="text-sm text-neutral-500">
            Manage and view all your products
          </p>
        </div>
        <button
          onClick={() => fetchProducts()}
          className="text-sm bg-primary-500 hover:bg-primary-600 px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 active:scale-95"
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
          <span>Refresh</span>
        </button>
      </div>

      <div className="p-6 md:p-8 lg:p-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 py-12">
            <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-neutral-600 font-semibold animate-pulse text-lg">
              Fetching products...
            </p>
          </div>
        ) : productData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
            {productData.map((product) => {
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discount,
              );
              
              // Handle both 'images' (plural) and 'image' (singular) from server
              // Also handle if it's already a string URL
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
              
              // Debug log (can be removed)
              if (!product.images && !product.image) {
                console.log("Product missing images:", product.name, product);
              }

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-md border border-neutral-200/60 group hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Product Image Container */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-t-3xl overflow-hidden p-4">
                    {product.discount > 0 && (
                      <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        {product.discount}% OFF
                      </div>
                    )}
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error("Image failed to load:", mainImage, product);
                        e.target.src = "/no_data.png";
                      }}
                    />
                  </div>

                  {/* Product Content */}
                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    {/* Product Name */}
                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-lg leading-tight line-clamp-2 mb-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </div>

                    {/* Categories */}
                    {product.category && product.category.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.category.map((cat) => (
                          <span
                            key={cat._id || cat}
                            className="text-[10px] bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-primary-200"
                          >
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sub Categories */}
                    {product.sub_category && product.sub_category.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.sub_category.map((sub) => (
                          <span
                            key={sub._id || sub}
                            className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border border-blue-200"
                          >
                            {sub.name || sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="pt-2 pb-1 border-t border-neutral-100">
                      <div className="flex flex-col items-center gap-2">
                        {product.discount > 0 ? (
                          <div className="flex flex-col items-center gap-1.5 w-full">
                            <div className="flex items-center justify-center gap-2.5 flex-wrap">
                              <span className="text-2xl font-black text-green-600">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-neutral-400 line-through font-semibold">
                                ₹{product.price?.toFixed(2) || 0}
                              </span>
                            </div>
                            {product.unit && (
                              <span className="text-xs text-neutral-500 font-medium">
                                per {product.unit}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl font-black text-neutral-800">
                              ₹{product.price?.toFixed(2) || 0}
                            </span>
                            {product.unit && (
                              <span className="text-xs text-neutral-500 font-medium">
                                per {product.unit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-center">
                      <span
                        className={`text-xs font-black px-4 py-2 rounded-full border-2 ${
                          product.stock_quantity > 0
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {product.stock_quantity > 0
                          ? `✓ In Stock: ${product.stock_quantity} ${product.unit || "units"}`
                          : "✗ Out of Stock"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto pt-4 border-t-2 border-neutral-100">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2 border border-red-200 hover:border-red-300"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-3xl border-2 border-dashed border-neutral-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-56 h-56 mb-8 opacity-40">
              <img
                src="/no_data.png"
                alt="No Data"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-3xl font-black text-neutral-800 mb-3">
              No Products Found
            </h3>
            <p className="text-neutral-600 max-w-md mb-8 text-base leading-relaxed">
              There are no products available at the moment. Start by uploading your first product!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductAdmin;
