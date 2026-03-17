"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/website/common/ProductCard";
import axios from "axios";
import { toast } from "react-toastify";

export default function Homepage() {
  const [menProducts, setMenProducts] = useState([]);
  const [ladiesProducts, setLadiesProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
        params: { limit: 8, categories: "mens-shirts, mens-shoes" },
      })
      .then((result) => {
        setMenProducts(result.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
        params: { limit: 8, categories: "beauty, tops" },
      })
      .then((result) => {
        setLadiesProducts(result.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  return (
    <>
      {/* Men's Products */}
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-7xl px-4 2xl:px-0">
          {/* <!-- Heading & Filters --> */}
          <div className="flex justify-center mb-10">
            <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Men's Products
            </h2>
          </div>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {menProducts.map((v, i) => {
              return <ProductCard key={i} product={v} />;
            })}
          </div>
        </div>
      </section>

      {/* Ladies Products */}
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-7xl px-4 2xl:px-0">
          {/* <!-- Heading & Filters --> */}
          <div className="flex justify-center mb-10">
            <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Ladies Products
            </h2>
          </div>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {ladiesProducts.map((v, i) => {
              return <ProductCard key={i} product={v} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
}
