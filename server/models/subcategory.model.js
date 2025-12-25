import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "Category reference is required"],
      },
    ],
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subcategorySchema);

export default SubCategoryModel;
