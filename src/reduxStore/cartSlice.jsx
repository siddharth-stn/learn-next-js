import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];

const initialState = {
  cart_items: cart,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, product) => {
      const existingIndex = state.cart_items.findIndex(
        (v) => v.id === product.payload.id,
      );
      if (existingIndex === -1) {
        const newProduct = {
          id: product.payload.id,
          name: product.payload.name,
          image: product.payload.image,
          price: product.payload.price,
          quantity: 1,
        };
        state.cart_items.push(newProduct);
        Cookies.set("cart", JSON.stringify(state.cart_items));
        toast.success("Item added successfully!");
      } else {
        if (state.cart_items[existingIndex].quantity < 5) {
          state.cart_items[existingIndex].quantity =
            state.cart_items[existingIndex].quantity + 1;
          toast.success("Item quantity added");
          Cookies.set("cart", JSON.stringify(state.cart_items));
        } else {
          toast.error("Order limit reached!");
        }
      }
    },
    updateCart: (state, { payload }) => {
      const { id, type } = payload;
      if (type === "minus") {
        const index = state.cart_items.findIndex((v) => v.id === id);
        if (state.cart_items[index].quantity > 1) {
          state.cart_items[index].quantity =
            state.cart_items[index].quantity - 1;
          Cookies.set("cart", JSON.stringify(state.cart_items));
        } else {
          toast.error("Item quantity can't be less than one!");
        }
      } else if (type === "add") {
        const index = state.cart_items.findIndex((v) => v.id === id);
        if (state.cart_items[index].quantity < 5) {
          state.cart_items[index].quantity =
            state.cart_items[index].quantity + 1;
          Cookies.set("cart", JSON.stringify(state.cart_items));
        } else {
          toast.error("Item quantity can't be more than five!");
        }
      }
    },
    deleteItem: (state, { payload }) => {
      const { id } = payload;
      const index = state.cart_items.findIndex((v) => v.id === id);
      state.cart_items.splice(index, 1);
      Cookies.set("cart", JSON.stringify(state.cart_items));
      toast.success("Item removed from cart!");
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, updateCart, deleteItem } = cartSlice.actions;

export default cartSlice.reducer;
