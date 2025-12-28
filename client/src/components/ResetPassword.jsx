import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // if (!location?.state?.data?.success) {
    //   navigate("/");
    // }
    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location.state.email,
        };
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPass = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!data.newPassword) return setError("Please enter password");
    if (!data.confirmPassword) return setError("Please enter confirm password");
    if (data.newPassword !== data.confirmPassword)
      return setError("Password and confirm password must be same");

    setError("");

    try {
      const response = await CustomAxios({
        ...AxiosApi.reset_password,
        data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          email: "",
          newPassword: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
      console.log("Reset Password Response - ", response);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  console.log("Data - ", data);
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-2xl mx-auto rounded p-6 shadow">
        <p>Reset your password</p>
        <form className="grid gap-4 mt-5">
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="newPassword" className="text-left font-medium">
              New Password
            </label>
            <span>:</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter your new password"
                value={data.newPassword}
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
            onClick={handleResetPass}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded
  font-semibold tracking-wide w-40 mx-auto"
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
