import React, { useEffect, useState } from "react";
import UploadSubcategory from "./UploadSubcategory";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

function SubCategory() {
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await CustomAxios({
        ...AxiosApi.get_subcategory,
      });
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCategory) => {
    setEditData(subCategory);
    setOpenSubCategory(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub category?")) {
      return;
    }

    try {
      const response = await CustomAxios({
        ...AxiosApi.delete_subcategory,
        url: AxiosApi.delete_subcategory.url.replace(":id", id),
      });

      if (response.data.success) {
        toast.success("Sub category deleted successfully");
        fetchSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleCloseModal = () => {
    setOpenSubCategory(false);
    setEditData(null);
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  return (
    <section className="h-full bg-neutral-50/50">
      <div className="p-4 bg-white shadow-sm border-b flex items-center justify-between sticky top-0 z-10">
        <h2 className="font-bold text-xl text-neutral-800">Sub Category</h2>
        <button
          onClick={() => setOpenSubCategory(true)}
          className="text-sm bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 active:scale-95"
        >
          <span>Add Sub Category</span>
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-medium animate-pulse">
              Fetching sub categories...
            </p>
          </div>
        ) : subCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 group hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="w-full h-32 bg-neutral-50 rounded-xl overflow-hidden mb-3 p-2">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-neutral-800 text-center truncate px-2 mb-1">
                  {sub.name}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {sub.category.map((cat) => (
                    <span
                      key={cat._id}
                      className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-2 border-t border-neutral-100 min-w-0">
                  <button
                    onClick={() => handleEdit(sub)}
                    className="flex-1 min-w-0 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="truncate">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="flex-1 min-w-0 bg-red-50 hover:bg-red-100 text-red-600 px-2 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span className="truncate">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl border-2 border-dashed border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-48 h-48 mb-6 opacity-40">
              <img
                src="/no_data.png"
                alt="No Data"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">
              No Sub Categories Found
            </h3>
            <p className="text-neutral-500 max-w-sm mb-8 text-sm">
              Add your first sub category to start organizing your products
              better.
            </p>
            <button
              onClick={() => setOpenSubCategory(true)}
              className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Create First Sub Category</span>
            </button>
          </div>
        )}
      </div>

      {openSubCategory && (
        <UploadSubcategory
          close={handleCloseModal}
          fetchSubCategories={fetchSubCategory}
          editData={editData}
        />
      )}
    </section>
  );
}

export default SubCategory;
