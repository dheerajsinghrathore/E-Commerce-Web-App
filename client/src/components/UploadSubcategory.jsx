import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import toast from "react-hot-toast";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";

function UploadSubcategory({ close, fetchSubCategories, editData }) {
    const [data, setData] = useState({
        name: "",
        image: "",
        category: []
    });
    const [loading, setLoading] = useState(false);
    const [allCategory, setAllCategory] = useState([]);

    // Populate form when editing
    useEffect(() => {
        if (editData) {
            setData({
                name: editData.name || "",
                image: editData.image || "",
                category: editData.category?.map(cat => cat._id) || []
            });
        } else {
            // Reset form when not editing
            setData({
                name: "",
                image: "",
                category: []
            });
        }
    }, [editData]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadImage = async (e) => {
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
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCategory = async () => {
        try {
            const response = await CustomAxios({
                ...AxiosApi.get_categories,
            });
            if (response.data.success) {
                setAllCategory(response.data.categories);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchAllCategory();
    }, []);

    const handleRemoveCategory = (categoryId) => {
        setData((prev) => ({
            ...prev,
            category: prev.category.filter(id => id !== categoryId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.name.trim()) return toast.error("Please enter subcategory name");
        if (!data.image) return toast.error("Please upload an image");
        if (data.category.length === 0) return toast.error("Please select at least one category");

        setLoading(true);
        try {
            let response;
            if (editData) {
                // Update existing subcategory
                response = await CustomAxios({
                    ...AxiosApi.update_subcategory,
                    url: AxiosApi.update_subcategory.url.replace(":id", editData._id),
                    data: data,
                });
            } else {
                // Create new subcategory
                response = await CustomAxios({
                    ...AxiosApi.create_subcategory,
                    data: data,
                });
            }

            if (response.data.success) {
                toast.success(response.data.message);
                if (fetchSubCategories) fetchSubCategories();
                if (close) close();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={close}>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b pb-4 mb-6 sticky top-0 bg-white z-10">
                    <h1 className="text-xl font-bold text-neutral-800 underline decoration-primary-400 decoration-4 underline-offset-8">
                        {editData ? "Edit Sub Category" : "Add Sub Category"}
                    </h1>
                    <button onClick={close} className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-full transition-all active:scale-90">
                        <IoClose size={24} />
                    </button>
                </div>

                <form className="grid gap-6" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-bold text-neutral-700">Sub Category Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter sub category name"
                            value={data.name}
                            onChange={handleOnChange}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-neutral-700">Display Image</label>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="uploadSubCategoryImage" className="w-full h-44 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-all overflow-hidden relative group">
                                {data.image ? (
                                    <>
                                        <img src={data.image} alt="Sub category" className="w-full h-full object-scale-down p-4 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white/90 text-neutral-800 px-4 py-2 rounded-lg font-bold text-sm">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mb-2">
                                            <IoClose size={24} className="rotate-45" />
                                        </div>
                                        <span className="font-bold">Click to upload image</span>
                                        <span className="text-xs">Supports: JPG, PNG, WEBP</span>
                                    </div>
                                )}
                            </label>
                            <input type="file" id="uploadSubCategoryImage" className="hidden" onChange={handleUploadImage} accept="image/*" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-neutral-700">Select Category</label>
                        <select
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-medium appearance-none cursor-pointer"
                            onChange={(e) => {
                                if (e.target.value && !data.category.includes(e.target.value)) {
                                    setData(prev => ({ ...prev, category: [...prev.category, e.target.value] }))
                                    e.target.value = ""; // Reset select after adding
                                }
                            }}
                            value=""
                        >
                            <option value="">Choose a category</option>
                            {allCategory.filter(cat => !data.category.includes(cat._id)).map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.category.map(catId => {
                                const cat = allCategory.find(c => c._id === catId);
                                return (
                                    <div key={catId} className="flex items-center gap-2 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg border border-primary-100 font-bold text-sm group">
                                        <span>{cat?.name}</span>
                                        <button type="button" onClick={() => handleRemoveCategory(catId)} className="hover:text-red-500 transition-colors">
                                            <IoClose size={18} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 mt-2 bg-primary-500 hover:bg-primary-600 text-white font-extrabold rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{editData ? "Update Sub Category" : "Add Sub Category"}</span>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default UploadSubcategory;