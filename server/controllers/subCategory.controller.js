import SubCategoryModel from "../models/subcategory.model.js";

export const createSubCategoryController = async (req, res) => {
  try {
    const { name, category, image } = req.body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
        error: "Invalid input",
      });
    }

    if (!image || typeof image !== "string" || image.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Image is required",
        error: "Invalid input",
      });
    }

    // Ensure category is an array and has at least one valid entry
    const categoryArray = Array.isArray(category) 
      ? category.filter(id => id && id.toString().trim() !== "")
      : category ? [category] : [];

    if (categoryArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category is required",
        error: "Invalid input",
      });
    }

    const newSubCategory = new SubCategoryModel({
      name: name.trim(),
      category: categoryArray,
      image: image.trim(),
    });
    const save = await newSubCategory.save();

    return res.status(201).json({
      success: true,
      data: save,
      message: "Sub-category created successfully",
    });
  } catch (error) {
    console.error("Error creating sub-category:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while creating sub-category",
      error: error.message,
    });
  }
};

export const getSubCategoriesByCategoryIdController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategoryModel.find({ category: categoryId })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subCategories,
      message: "Sub-categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sub-categories",
    });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: subCategories,
      message: "Sub-categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sub-categories",
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, image } = req.body;

    // Validate required fields with specific error messages
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
        error: "Invalid input",
      });
    }

    if (!image || typeof image !== "string" || image.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Image is required",
        error: "Invalid input",
      });
    }

    // Ensure category is an array and has at least one valid entry
    const categoryArray = Array.isArray(category) 
      ? category.filter(id => id && id.toString().trim() !== "")
      : category ? [category] : [];

    if (categoryArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category is required",
        error: "Invalid input",
      });
    }

    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      { name: name.trim(), category: categoryArray, image: image.trim() },
      { new: true, runValidators: true },
    ).populate("category");

    if (!updatedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedSubCategory,
      error: false,
      message: "Sub-category updated successfully",
    });
  } catch (error) {
    console.error("Error updating sub-category:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating sub-category",
      error: error.message,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-category not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Sub-category deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting sub-category",
    });
  }
};
