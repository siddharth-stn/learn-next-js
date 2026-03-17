import axios from "axios";

export const menProducts = () => {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
      params: { limit: 8, categories: "mens-shirts, mens-shoes" },
    })
    .then((result) => {
      return result.data.data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export const ladiesProducts = () => {
  return axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/products.php`, {
      params: { limit: 8, categories: "beauty, tops" },
    })
    .then((result) => {
      return result.data.data;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};
