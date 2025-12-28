import React, { useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";

function Header() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUserMenu, setUserOpenMenu] = useState(false);

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <header className="h-auto md:h-20 shadow-md sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="inline-flex">
              <img src={logo} width={80} alt="logo" />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="flex justify-center">
            <Search />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-10 justify-end">
            {!user.loading && (
              <div className="cursor-pointer relative">
                {user?._id ? (
                  <div className="relative">
                    <div
                      onClick={() => setUserOpenMenu((prev) => !prev)}
                      className="flex items-center gap-1 cursor-pointer group"
                    >
                      <p className="text-neutral-700 font-medium group-hover:text-primary-400 transition-colors">
                        Account
                      </p>
                      {openUserMenu ? (
                        <GoTriangleUp className="text-neutral-500 group-hover:text-primary-400" />
                      ) : (
                        <GoTriangleDown className="text-neutral-500 group-hover:text-primary-500" />
                      )}
                    </div>

                    {openUserMenu && (
                      <div className="absolute right-0 top-12 z-20">
                        <div className="bg-white rounded-lg shadow-xl border border-neutral-100 min-w-[220px] p-1 animate-in fade-in zoom-in duration-200">
                          {/* Triangle Arrow */}
                          <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white border-t border-l border-neutral-100 rotate-45"></div>
                          <UserMenu close={() => setUserOpenMenu(false)} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={redirectToLogin}
                    className="text-neutral-700 font-semibold hover:text-primary-200 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            )}

            <button className="flex items-center gap-2 hover:bg-green-700 bg-green-800 px-4 py-3 rounded text-white shadow-sm transition-all active:scale-95">
              <div className="animate-bounce">
                <BsCart4 size={24} />
              </div>
              <div className="font-bold">
                <p>My Cart</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
