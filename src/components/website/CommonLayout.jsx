"use client";
import React from "react";
import Header from "@/components/website/common/Header";
import Footer from "@/components/website/common/Footer";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { reduxStore } from "@/reduxStore/store";

export default function CommonLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Provider store={reduxStore}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Provider>
      </div>
    </>
  );
}
