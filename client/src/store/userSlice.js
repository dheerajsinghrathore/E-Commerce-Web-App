import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  mobile: "",
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      Object.assign(state, initialValue);
      state.loading = false;
    },
  },
});

export const { setUserDetails, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
