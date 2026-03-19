import ViewCart from "@/components/website/ViewCart";
import React from "react";

export const metadata = {
  title: "Cart",
  description: "This is the cart page",
};

export default function page() {
  return (
    <>
      <ViewCart />
    </>
  );
}
