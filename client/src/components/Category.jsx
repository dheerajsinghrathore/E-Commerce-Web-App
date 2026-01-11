import React, { useEffect, useState } from "react";
import UploadCategoryModel from "./UploadCategoryModel";
import CustomAxios from "../utils/CustomAxios";
import AxiosApi from "../common/AxiosApi";
import AxiosToastError from "../utils/AxiosToastError";
import ConfirmBox from "./ConfirmBox";
import toast from "react-hot-toast";

function Category() {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editData, setEditData] = useState(null);
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CustomAxios({
                ...AxiosApi.get_categories,
            });

            if (response.data.success) {
                setCategories(response.data.categories || []);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDeleteCategory = async () => {
        try {
            const response = await CustomAxios({
                ...AxiosApi.delete_category,
                data: {
                    _id: deleteId
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchCategories();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="h-full bg-neutral-50/50">
            <div className="p-4 bg-white shadow-sm border-b flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-bold text-xl text-neutral-800">Categories</h2>
                <button
                    onClick={() => setOpenUploadCategory(true)}
                    className="text-sm bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-xl text-white font-bold transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 active:scale-95"
                >
                    <span>Adds Category</span>
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-neutral-500 font-medium animate-pulse">Fetching your categories...</p>
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 group hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="w-full h-32 bg-neutral-50 rounded-xl overflow-hidden mb-3 p-2">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-scale-down group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold text-neutral-800 text-center truncate px-2 mb-3">
                                    {category.name}
                                </h3>

                                <div className="flex items-center justify-between gap-2 mt-auto">
                                    <button
                                        onClick={() => {
                                            setEditData(category);
                                            setOpenUploadCategory(true);
                                        }}
                                        className="flex-1 text-xs py-1.5 bg-green-100 text-green-700 font-bold rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(category._id);
                                            setOpenConfirmBoxDelete(true);
                                        }}
                                        className="flex-1 text-xs py-1.5 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl border-2 border-dashed border-neutral-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-64 h-64 mb-6 drop-shadow-2xl">
                            <img
                                src="/no_data.png"
                                alt="No Data"
                                className="w-full h-full object-contain filter "
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-800 mb-2">No Categories Yet</h3>
                        <p className="text-neutral-500 max-w-sm mb-8">
                            Start building your store by adding your first category. It's the best way to keep your products organized!
                        </p>
                        <button
                            onClick={() => setOpenUploadCategory(true)}
                            className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
                        >
                            <span>Create First Category</span>
                        </button>
                    </div>
                )}
            </div>

            {openUploadCategory && (
                <UploadCategoryModel
                    initialData={editData}
                    fetchCategories={fetchCategories}
                    close={() => {
                        setOpenUploadCategory(false);
                        setEditData(null);
                    }}
                />
            )}

            {openConfirmBoxDelete && (
                <ConfirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                />
            )}
        </section>
    );
}

export default Category;
