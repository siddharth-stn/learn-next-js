import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import cartSlice from "./cartSlice";

export const reduxStore = configureStore({
  reducer: {
    login: loginSlice,
    cart: cartSlice,
  },
});
