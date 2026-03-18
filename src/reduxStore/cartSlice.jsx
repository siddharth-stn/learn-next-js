import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];

const initialState = {
  cart_items: cart,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, product) => {
      const newProduct = {
        id: product.payload.id,
        name: product.payload.name,
        image: product.payload.image,
        price: product.payload.price,
        quantity: 1,
      };

      let finalCart = [newProduct, ...state.cart_items];
      state.cart_items = finalCart;
      Cookies.set("cart", JSON.stringify(finalCart));
    },
    updateCart: (state) => {},
    deleteCart: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, updateCart, deleteCart } = cartSlice.actions;

export default cartSlice.reducer;
