import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart_items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (cart, product) => {},
    updateCart: (state) => {},
    deleteCart: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, updateCart, deleteCart } = cartSlice.actions;

export default cartSlice.reducer;
