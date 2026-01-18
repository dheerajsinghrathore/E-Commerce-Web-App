import { createSlice } from "@reduxjs/toolkit";
import SubCategory from "../components/SubCategory";

const initialState = {
  products: [],
  subCategory: [],
  allCategory: [],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setAllCategory(state, action) {
      state.isLoading = false;
      state.allCategory = [...action.payload];
    },
  },
});

export const { setAllCategory } = productSlice.actions;

export default productSlice.reducer;
