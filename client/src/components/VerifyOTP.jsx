import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

function VerifyOTP() {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await CustomAxios({
        ...AxiosApi.verify_otp_password,
        data: {
          otp: data.join(""),
          email: location?.state?.email,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email,
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-2xl mx-auto rounded p-6 shadow">
        <p>Verify OTP</p>
        <form className="grid gap-4 mt-5">
          <div className="grid grid-cols-[150px_10px_1fr] items-center gap-2">
            <label htmlFor="otp" className="text-left font-medium">
              Enter OTP
            </label>

            <span>:</span>
            <div className="flex items-center gap-2 justify-between">
              {data.map((element, index) => {
                return (
                  <input
                    key={"otp" + index}
                    type="text"
                    id={`otp-${index}`}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);

                      // Move to next input if value is entered
                      if (value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Move to previous input on backspace if current is empty
                      if (e.key === "Backspace" && !data[index] && index > 0) {
                        inputRef.current[index - 1].focus();
                      }
                    }}
                    ref={(ref) => (inputRef.current[index] = ref)}
                    maxLength={1}
                    placeholder="*"
                    className="bg-blue-50 items-center max-w-16 p-2 border rounded w-full outline-none focus:border-primary-200 text-center font-semibold text-neutral-800"
                  />
                );
              })}
            </div>

            {/* {valideEmail && !valideEmail.isValid && (
              <p className="text-red-500 text-sm mt-1">{valideEmail.message}</p>
            )} */}
          </div>

          <button
            onClick={handleVerifyOTP}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded
  font-semibold tracking-wide w-40 mx-auto"
          >
            Submit
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

export default VerifyOTP;
