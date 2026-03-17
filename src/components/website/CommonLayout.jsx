import React from "react";
import Header from "@/components/website/common/Header";
import Footer from "@/components/website/common/Footer";
import { ToastContainer } from "react-toastify";

export default function CommonLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
