import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const loginState = Cookies.get("login");

const initialState = {
  isLogin: loginState || 0,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state) => {
      state.isLogin = 1;
      Cookies.set("login", 1);
    },
    logout: (state) => {
      state.isLogin = 0;
      Cookies.remove("login");
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
