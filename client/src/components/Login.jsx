import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import validateEmail from "../utils/validateEmail";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";

function Login() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      navigate("/");
    }
  }, [user, navigate]);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [valideEmail, setValideEmail] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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
    setLoading(true);
    setLoadingMessage("");

    // Show a message if it takes more than 4 seconds
    const timer = setTimeout(() => {
      setLoadingMessage("The server is taking a bit longer than usual, please stay with us! 🚀");
    }, 4000);

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
    } catch (error) {
      AxiosToastError(error);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-8 w-full max-w-lg mx-auto rounded-3xl p-8 shadow-2xl border border-neutral-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-neutral-800 mb-2">Welcome Back</h2>
          <p className="text-neutral-500 font-medium">Please enter your details to sign in</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-neutral-700 ml-1">
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={data.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-neutral-50 border-2 border-neutral-100 p-3.5 rounded-2xl outline-none focus:border-primary-400 focus:bg-white transition-all text-sm disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" racer-label="true" className="text-sm font-bold text-neutral-700">
                Password
              </label>
              <Link
                to={"/forgot-password"}
                className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-neutral-50 border-2 border-neutral-100 p-3.5 rounded-2xl outline-none focus:border-primary-400 focus:bg-white transition-all text-sm disabled:opacity-50 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
              </button>
            </div>
          </div>

          {submitted && error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black tracking-wide transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3
                ${loading
                  ? "bg-neutral-200 text-neutral-500 cursor-not-allowed shadow-none"
                  : "bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/30"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {loadingMessage && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[11px] text-blue-700 font-bold text-center animate-pulse">
            {loadingMessage}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-neutral-100 text-center">
          <p className="text-sm font-medium text-neutral-500">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="text-primary-500 font-bold hover:text-primary-600 transition-colors ml-1"
            >
              Join us today
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
