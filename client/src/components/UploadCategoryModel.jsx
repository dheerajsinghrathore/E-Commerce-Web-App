import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

import uploadImage from "../utils/UploadImage";
import AxiosApi from "../common/AxiosApi";
import CustomAxios from "../utils/CustomAxios";
import AxiosToastError from "../utils/AxiosToastError";

const UploadCategoryModel = ({ close, fetchCategories, initialData }) => {
  const [data, setData] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
  });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadImage(file);
      if (response) {
        setData((prev) => ({
          ...prev,
          image: response,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      return toast.error("Please enter a category name");
    }

    if (!data.image) {
      return toast.error("Please upload a category image");
    }

    setLoading(true);
    try {
      const apiConfig = initialData?._id ? AxiosApi.update_category : AxiosApi.add_category;
      const response = await CustomAxios({
        ...apiConfig,
        data: {
          ...data,
          _id: initialData?._id
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Operation successful");
        if (fetchCategories) fetchCategories();
        if (close) close();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={close}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-xl font-bold text-neutral-800">{initialData?._id ? "Edit Category" : "Add Category"}</h1>
          <button
            onClick={close}
            className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-all"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <label
              htmlFor="categoryName"
              className="text-sm font-semibold text-neutral-700"
            >
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="categoryImage"
              className="text-sm font-semibold text-neutral-700"
            >
              Image
            </label>
            <div className="flex flex-col gap-3">
              <label
                htmlFor="categoryImage"
                className="w-full h-36 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all overflow-hidden"
              >
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Category"
                    className="w-full h-full object-scale-down p-2"
                  />
                ) : (
                  <span>Upload Image</span>
                )}
              </label>
              <input
                type="file"
                id="categoryImage"
                className="hidden"
                onChange={handleUploadCategoryImage}
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98] ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {initialData?._id ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
