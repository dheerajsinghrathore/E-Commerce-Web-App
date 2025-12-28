import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";

function Header() {
  const navigate = useNavigate();

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
          <div className="lg:flex items-center gap-10 justify-end">
            <button onClick={redirectToLogin}>Login</button>
            <button className="flex items-center gap-2 hover:bg-green-700 bg-green-800 px-3 py-3 rounded text-white">
              {/* Add to cart icon */}
              <div className="animate-bounce">
                <BsCart4 size={25} />
              </div>
              <div className="font-semibold">
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
