import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import validateEmail from "../utils/validateEmail";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

function Login() {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!data.email) return setError("Please enter your email");
    if (!valideEmail?.isValid) return setError("Please enter a valid email");
    if (!data.password) return setError("Please enter password");

    setError("");
    // alert("Registration Success 🎉");

    try {
      const response = await CustomAxios({
        ...AxiosApi.login,
        data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
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
              className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200"
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
                className="bg-blue-50 p-2 border rounded w-full pr-10 outline-none focus:border-primary-200"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
          </div>
          <p className="block ml-auto hover:text-blue-500">
            <Link
              to={"/forgot-password"}
              className="font-semibold text-blue-400 hover:text-blue-800"
            >
              Forgot Password ?
            </Link>
          </p>
          {submitted && error && (
            <p className="text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}
          <button
            onClick={handleLogin}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded
  font-semibold tracking-wide w-40 mx-auto"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-5">
          Don't have account ?{" "}
          <Link
            to={"/register"}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
