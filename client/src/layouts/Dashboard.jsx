import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiUser,
  FiBox,
  FiMapPin,
  FiLayers,
  FiGrid,
  FiShoppingCart,
  FiUpload,
} from "react-icons/fi";

function Dashboard() {
  const user = useSelector((state) => state.user);
  
  return (
    <section className="bg-neutral-50/50 min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Left Side menu - Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-2">
            <h2 className="px-4 py-4 text-xl font-extrabold text-neutral-800 border-b border-neutral-50 mb-3">
              Dashboard
            </h2>
            <nav className="flex flex-col gap-1.5">
              <NavLink
                to="/dashboard/products"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiShoppingCart
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Products</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/upload-product"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiUpload
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Upload Product</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/category"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiLayers
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Category</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/sub-category"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiGrid
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Sub Category</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiUser
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Profile</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/my-orders"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiBox
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>My Orders</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/address"
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-primary-50 text-primary-600 border-r-4 border-primary-500 shadow-sm font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 font-medium"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FiMapPin
                      className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "text-primary-500"
                          : "text-neutral-400 group-hover:text-primary-400"
                      }`}
                    />
                    <span>Saved Addresses</span>
                  </>
                )}
              </NavLink>
            </nav>
          </div>
        </aside>

        {/* Right Side Content - Main View */}
        <main className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden min-h-[70vh] transition-all duration-500">
          <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
}

export default Dashboard;
