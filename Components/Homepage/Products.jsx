import Link from "next/link";
import Image from "next/image";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { useEffect, useState } from "react";
import { addToCart, getSessionUser } from "../../Services/functions";
import { jgi } from "../Topbar";
import { BsSearch } from "react-icons/bs";

function Products({ products, addToCar }) {
  // const halfLength = Math.ceil(products.length / 2);
  // const firstHalf = products.slice(0, halfLength);

  // filter products by category
  const dynamicBtn = [
    "All",
    ...new Set(products.map((category) => category?.data()?.productcategory)),
  ];
  // state for category
  const [category, setCategory] = useState("All");

  // state for products
  const [productsList, setProductsList] = useState(products);

  // filter products based on category
  useEffect(() => {
    if (category === "All") {
      setProductsList(products);
    } else {
      setProductsList(
        products?.filter((item) => item.data().productcategory === category)
      );
    }
  }, [category]);
  // console.log(products);
  // search by input value
  const [search, setSearch] = useState("");

  return (
    <div className="product-session-con">
      {/* homepage product category container */}
      <div className="homepage-category-main-con">
        <div className="category-con">
          {dynamicBtn.map((btn, index) => (
            <button
              key={index}
              className={`${
                btn === category ? "category-d active-category-d" : "category-d"
              }`}
              onClick={() => setCategory(btn)}
            >
              <img
                className="category-image"
                style={{ width: "40px" }}
                src={
                  btn === "Beauty"
                    ? "/beauty Background Removed.png"
                    : btn === "Fashion"
                    ? "/fashion Background Removed.png"
                    : btn === "Assocceries"
                    ? "/assesories Background Removed.png"
                    : btn === "18+"
                    ? "/gadgets Background Removed.png"
                    : "/store Background Removed.png" // Set a default or empty string if none of the conditions match
                }
                alt=""
              />

              <span> {btn}</span>
            </button>
          ))}
        </div>

        <form>
          <BsSearch />
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name . . ."
          />
        </form>
      </div>
      {/* end of category filter container */}
      <div className="product-main-con">
        <h3>Products</h3>

        {/* PRODUCTS ARRAY */}

        <div className="products-con">
          {productsList
            ?.filter((item) => {
              if (item.data().productname === "") {
                return item;
              } else if (
                item
                  .data()
                  .productname.toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                return item;
              } else {
                return;
              }
            })
            ?.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                productimages={product.data().image}
                productname={product.data().productname}
                productprice={product.data().productprice}
                productoldprice={product.data().productoldprice}
                addToCar={addToCar}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Products;

function Product({
  addToCar,
  id,
  productimages,
  productname,
  productprice,
  productoldprice,
}) {
  // percentage of peomo
  const priceDifference =
    parseFloat(productoldprice.toString()) -
    parseFloat(productprice.toString());

  const percentageDifference = Math.floor(
    (priceDifference / parseFloat(productoldprice.toString())) * 100
  );

  return (
    <div className="products">
      <div className="product-img">
        {productoldprice && (
          <p className="percentage-off">
            {percentageDifference}% <br />
            <span>off</span>
          </p>
        )}
        <Link
          href={`/ClientDynamic/${id}`}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={productimages[0]}
              alt="img"
              className="home-product-img"
              fill
              sizes="100vw"
            />
          </div>
        </Link>
      </div>
      <Link
        href={`/ClientDynamic/${id}`}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <p className="product-name">{productname}</p>
      </Link>

      <div className="price">
        <p className="product-price">
          $ {Number(productprice).toLocaleString()}
        </p>
        <p className="product-oldprice">
          {productoldprice && "$ " + Number(productoldprice).toLocaleString()}
        </p>
      </div>
      <button className="addto-cart" onClick={(e) => addToCar(e, id)}>
        Add to cart
      </button>
    </div>
  );
}
