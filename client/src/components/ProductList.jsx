import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useSelector } from "react-redux";

function ProductList() {
  const { categoryName, subcategoryName } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await CustomAxios({
        ...AxiosApi.get_categories,
      });
      if (response.data.success) {
        const allCats = response.data.categories || [];
        setCategories(allCats);
        const cat = allCats.find((c) => c.name === categoryName);
        if (cat) {
          setCurrentCategory(cat);
          fetchSubCategories(cat._id);
          fetchProducts(cat._id);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await CustomAxios({
        url: `/api/subcategory/category/${categoryId}`,
        method: "get",
      });
      if (response.data.success) {
        setSubCategories(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchProducts = async (categoryId, subCatId = null) => {
    try {
      setLoading(true);
      const response = await CustomAxios({
        ...AxiosApi.get_products_by_category,
        data: {
          id: categoryId,
          subcategory: subCatId,
        },
      });
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categoryName]);

  useEffect(() => {
    if (currentCategory) {
      const subCat = subCategories.find((s) => s.name === subcategoryName);
      setCurrentSubCategory(subCat);
      fetchProducts(currentCategory._id, subCat?._id);
    }
  }, [subcategoryName, subCategories]);

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r p-4 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
          <h2 className="font-bold text-lg mb-4 text-neutral-800 border-b pb-2">
            Subcategories
          </h2>
          <div className="flex flex-col gap-2">
            <Link
              to={`/category/${categoryName}`}
              className={`p-3 rounded-xl transition-all font-medium ${
                !subcategoryName
                  ? "bg-primary-50 text-primary-600 shadow-sm border border-primary-100"
                  : "hover:bg-neutral-50 text-neutral-600"
              }`}
            >
              All {currentCategory?.name}
            </Link>
            {subCategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/category/${categoryName}/${sub.name}`}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${
                  subcategoryName === sub.name
                    ? "bg-primary-50 text-primary-600 shadow-sm border border-primary-100"
                    : "hover:bg-neutral-50 text-neutral-600"
                }`}
              >
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-8 h-8 object-scale-down rounded-lg bg-white p-1 border shadow-sm"
                />
                <span className="truncate">{sub.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-neutral-800">
                {subcategoryName || currentCategory?.name}
              </h1>
              <p className="text-neutral-500 text-sm font-medium mt-1">
                Found {products.length} products
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {new Array(8).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-neutral-100 p-4 space-y-4 animate-pulse"
                >
                  <div className="w-full aspect-square bg-neutral-100 rounded-2xl" />
                  <div className="h-4 bg-neutral-100 rounded-full w-3/4" />
                  <div className="h-4 bg-neutral-100 rounded-full w-1/2" />
                  <div className="flex justify-between pt-2">
                    <div className="h-8 bg-neutral-100 rounded-lg w-20" />
                    <div className="h-8 bg-neutral-100 rounded-lg w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl border border-neutral-100 p-4 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative aspect-square mb-4 bg-neutral-50 rounded-2xl overflow-hidden p-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-neutral-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-neutral-400 text-xs font-medium mb-4">
                    {product.unit}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-4 border-t border-neutral-50">
                    <div>
                      <p className="font-black text-lg text-neutral-800">
                        ₹
                        {product.price -
                          (product.price * product.discount) / 100}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-xs text-neutral-400 line-through">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary-500/20">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
              <img
                src="/no_products.png"
                alt="No Products"
                className="w-48 h-48 opacity-20 mb-6"
              />
              <h3 className="text-xl font-bold text-neutral-700">
                No products found
              </h3>
              <p className="text-neutral-500 mt-2">
                Try checking other categories or subcategories.
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default ProductList;
