import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="border-t border-gray-300 p-4">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center text-gray-600 gap-3">
        <div className="text-center lg:text-left">
          &copy; {new Date().getFullYear()} My E-commerce App. All rights reserved.
        </div>

        <div className="flex justify-center items-center space-x-3">
          <a href="/privacy" className="text-blue-500 hover:underline text-sm">
            Privacy Policy
          </a>
          <span className="text-gray-400">|</span>
          <a href="/terms" className="text-blue-500 hover:underline text-sm">
            Terms of Service
          </a>
        </div>

        <div className="flex justify-center lg:justify-end items-center">
          <a href="https://facebook.com" className="mx-2 text-blue-600 hover:text-blue-800">
            <FaFacebook size={20} />
          </a>
          <a href="https://twitter.com" className="mx-2 text-blue-400 hover:text-blue-600">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" className="mx-2 text-pink-500 hover:text-pink-700">
            <FaInstagram size={20} />
          </a>
          <a href="https://linkedin.com" className="mx-2 text-blue-700 hover:text-blue-900">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
