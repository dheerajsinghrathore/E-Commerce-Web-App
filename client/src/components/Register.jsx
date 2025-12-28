import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import validateEmail from "../utils/validateEmail";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [valideEmail, setValideEmail] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error as soon as user starts typing
    if (error) setError("");

    if (name === "email") {
      const emailCheck = validateEmail(value);
      setValideEmail(emailCheck);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!data.name) return setError("Please enter your name");
    if (!data.email) return setError("Please enter your email");
    if (!valideEmail?.isValid) return setError("Please enter a valid email");
    if (!data.password) return setError("Please enter password");
    if (!data.confirmPassword) return setError("Please enter confirm password");
    if (data.password !== data.confirmPassword)
      return setError("Password and confirm password must be same");

    setError("");
    // alert("Registration Success 🎉");

    try {
      const response = await CustomAxios({
        ...AxiosApi.register,
        data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
      console.log("Register Response - ", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-2xl mx-auto rounded p-6 shadow">
        <p>Welcome to E-commerce</p>
        <form className="grid gap-4 mt-5">
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="name" className="text-left font-medium">
              Name
            </label>
            <span>:</span>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200 text-neutral-800"
            />
          </div>
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="email" className="text-left font-medium">
              Email
            </label>

            <span>:</span>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200 text-neutral-800"
            />
            {/* {valideEmail && !valideEmail.isValid && (
              <p className="text-red-500 text-sm mt-1">{valideEmail.message}</p>
            )} */}
          </div>
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="password" className="text-left font-medium">
              Password
            </label>

            <span>:</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={handleChange}
                className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200 text-neutral-800"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="confirmPassword" className="text-left font-medium">
              Confirm Password
            </label>
            <span>:</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter your confirm password"
                value={data.confirmPassword}
                onChange={handleChange}
                className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200 text-neutral-800"
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          {submitted && error && (
            <p className="text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}
          <button
            onClick={handleRegister}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded
  font-semibold tracking-wide w-40 mx-auto"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-5">
          Already have account ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
