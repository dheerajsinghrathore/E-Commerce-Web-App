import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    address_line: {
      type: String,
      required: [true, "Address line is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    postal_code: {
      type: String,
      required: [true, "Postal code is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    mobile_number: {
      type: Number,
      required: [true, "Mobile number is required"],
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
