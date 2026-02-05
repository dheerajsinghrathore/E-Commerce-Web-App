import React, { useEffect, useState, useRef } from "react";
import banner from "../assets/banner.jpg";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CustomAxios({
        ...AxiosApi.get_categories,
      });
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const scroll = (direction) => {
    const { current } = containerRef;
    if (current) {
      const scrollAmount = 400;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Banner Section */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 bg-white group">
          <img
            src={banner}
            alt="Fresh Grocery Banner"
            className="w-full h-[300px] md:h-[450px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-8 md:p-16">
            <div className="max-w-xl text-white space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-6xl font-black leading-tight drop-shadow-lg">
                Freshness <br /> at Your Doorstep
              </h1>
              <p className="text-lg md:text-xl font-medium text-neutral-100 drop-shadow-md">
                Get the best quality groceries delivered within minutes.
              </p>
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-primary-500/30 transition-all active:scale-95">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Category Slider Section */}
        <div className="relative group/category">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-800 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-neutral-500 font-medium text-sm mt-1">
                Explore our wide range of fresh and quality products
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl shadow-sm text-neutral-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-90"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl shadow-sm text-neutral-600 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all active:scale-90"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar pb-8 px-2"
          >
            {loading ? (
              // Skeleton Loaders
              new Array(8).fill(0).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-[140px] md:w-[180px] space-y-4 animate-pulse">
                  <div className="w-full aspect-square bg-neutral-200 rounded-3xl" />
                  <div className="h-4 bg-neutral-200 rounded-full w-3/4 mx-auto" />
                </div>
              ))
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  to={`/category/${category.name}`}
                  key={category._id}
                  className="flex-shrink-0 w-[140px] md:w-[180px] group/item text-center cursor-pointer"
                >
                  <div className="w-full aspect-square bg-white rounded-3xl border border-neutral-100 shadow-sm p-4 mb-4 transition-all duration-300 group-hover/item:shadow-xl group-hover/item:shadow-primary-500/10 group-hover/item:border-primary-100 group-hover/item:-translate-y-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-scale-down transition-transform duration-500 group-hover/item:scale-110"
                    />
                  </div>
                  <h3 className="font-bold text-neutral-700 group-hover/item:text-primary-600 transition-colors text-sm md:text-base">
                    {category.name}
                  </h3>
                </Link>
              ))
            ) : (
              <div className="w-full py-12 text-center text-neutral-500 font-medium bg-white rounded-3xl border-2 border-dashed border-neutral-200 italic">
                No categories found at the moment.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles for Slider */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default Home;
