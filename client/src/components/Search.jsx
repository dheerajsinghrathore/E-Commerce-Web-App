import React, { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    setIsSearch(location.pathname === "/search");
  }, [location]);

  return (
    <div
      className="group w-full max-w-[420px]
      h-12 rounded-xl border border-gray-300 bg-gray-50
      focus-within:border-primary-500 focus-within:bg-white
      flex items-center transition-all duration-200 overflow-hidden"
    >
      <IoSearch
        size={20}
        className="ml-3 text-gray-400 group-focus-within:text-primary-500 transition"
      />

      {!isSearch ? (
        <div
          onClick={() => navigate("/search")}
          className="flex-1 h-full flex items-center px-2 cursor-text overflow-hidden whitespace-nowrap text-base"
        >
          <TypeAnimation
            sequence={[
              'Search "dairy"',
              1000,
              'Search "food"',
              1000,
              'Search "biscuits"',
              1000,
              'Search "dry fruits"',
              1000,
            ]}
            speed={40}
            repeat={Infinity}
            className="truncate"
          />
        </div>
      ) : (
        <input
          autoFocus
          placeholder="Search for grocery dairy and more"
          className="flex-1 h-full bg-transparent px-2 text-base outline-none min-w-0"
        />
      )}
    </div>
  );
}

export default Search;
