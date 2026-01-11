import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
import toast from "react-hot-toast";

function UserProfileEdit({ closeEdit }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        await CustomAxios({
          ...AxiosApi.upload_avatar,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // 2. Update user profile info
      const response = await CustomAxios({
        ...AxiosApi.update_user,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Profile updated successfully");

        // 3. Refresh user state
        const updatedUser = await fetchUserDetails();
        dispatch(setUserDetails(updatedUser.data));

        if (closeEdit) closeEdit();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeEdit}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeEdit}
          className="absolute right-4 top-4 text-neutral-400 hover:text-red-500 transition-colors p-1 hover:bg-neutral-50 rounded-full"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
          Edit Profile
        </h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-2">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              {(previewImage || user.avatar) ? (
                <img
                  src={previewImage || user.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 group-hover:border-primary-300 transition-all"
                />
              ) : (
                <FaRegUserCircle className="text-8xl text-gray-400 group-hover:text-primary-400 transition-colors" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Edit</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />

            <button
              type="button"
              onClick={handleAvatarClick}
              className="mt-3 cursor-pointer px-4 py-1.5 bg-neutral-100 text-neutral-700 text-sm font-semibold rounded-full hover:bg-primary-50 hover:text-primary-600 transition-all font-semibold"
            >
              Change Avatar
            </button>
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"
              type="text"
              id="mobile"
              name="mobile"
              value={data.mobile}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2.5 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UserProfileEdit;
