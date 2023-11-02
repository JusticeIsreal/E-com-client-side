import { useContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { useForm } from "react-hook-form";
import { Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
// firebase
import { db, storage } from "../Firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
// components
import Topbar from "../Components/Topbar";
import Advantages from "../Components/Advantages";
import Banner from "../Components/Homepage/Banner";
import NewArrivals from "../Components/Homepage/NewArrivals";
import Products from "../Components/Homepage/Products";
import NewsLetter from "../Components/Homepage/NewsLetter";
import Promo from "../Components/Homepage/Promo";
import Footer from "../Components/Footer";
import Modal from "../Components/Modal";
import Review from "../Components/Homepage/Review";
import Advert from "../Components/Homepage/Advert";
import { AuthGuard } from "./api/auth/AuthGuard.";
import { useRouter } from "next/router";
import { addToCart, allCartItem, getSessionUser } from "../Services/functions";
import { CartQuantityContext } from "./_app";

const Homepage = () => {
  const router = useRouter();
  const [loginTriger, setLoginTriger] = useState(false);

  // Products from firebase db
  const [products, setProducts] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "products"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setProducts(snapshot.docs);
      }
    );
  }, [router, loginTriger]);

  // ADD TO CART

  const setCartQty = useContext(CartQuantityContext).setCartQty;

  // console.log(existingItemsInLocal);
  const existingItemsInLocalDefault = localStorage.getItem("localCartItem")
    ? JSON.parse(localStorage.getItem("localCartItem"))
    : [];
  // add to art
  const [localCartLength, setLocalCartLength] = useState(
    existingItemsInLocalDefault
  );

  const [localCartTriger, setLocalCartTriger] = useState(true);
  const addToCar = async (e, id) => {
    setLocalCartTriger(!localCartTriger);
    // get cart items in local storage
    const existingItemsInLocal = localStorage.getItem("localCartItem")
      ? JSON.parse(localStorage.getItem("localCartItem"))
      : [];

    e.target.innerHTML = "Loading ...";
    const productDoc = doc(db, "products", id);
    const productSnapshot = await getDoc(productDoc);
    const productData = productSnapshot.data();
    const userSession = await getSessionUser();
    productData.productID = id;
    // if (!userSession) {
    //   return setLoginTriger(true);
    // }
    // check if product is already in user cart
    const productExist = userSession?.userCart.find(
      (item) => item.productID === id
    );

    // check if product is already in local storage
    const productExistInLocal = existingItemsInLocal?.find(
      (item) => item.productID === id
    );

    if (userSession) {
      if (
        (productExist && !productExist.productID) ||
        productExist === undefined
      ) {
        const cartResponse = await addToCart(productData, id);
        // console.log("cartResponse");
        if (cartResponse === "SUCCESS") {
          const userData = await getSessionUser();
          setCartQty(userData?.user.cart.length);
          e.target.innerHTML = "Now In Cart";
          notifications.show({
            title: "Notification",
            message: "Successful , Item added to cart",
          });
        }
      } else {
        notifications.show({
          title: "Notification",
          message: "Failed, Item already in cart",
          color: "red",
        });
        e.target.innerHTML = "Already In Cart";
      }
    } else {
      if (
        (productExistInLocal && !productExistInLocal.productID) ||
        productExistInLocal === undefined
      ) {
        const localCart = [...existingItemsInLocal];
        localCart.push({ ...productData, quantity: 1, _id: id });
        setLocalCartLength(localCart);
        localStorage.setItem("localCartItem", JSON.stringify(localCart));
        e.target.innerHTML = "Now In Cart";
        notifications.show({
          title: "Notification",
          message: "Successful , Item added to cart",
        });
      } else {
        notifications.show({
          title: "Notification",
          message: "Failed, Item already in cart",
          color: "red",
        });
        e.target.innerHTML = "Already In Cart";
      }
    }
    setLocalCartTriger(!localCartTriger);
    // if (!userSession) {
    //   return setLoginTriger(true);
    // }
  };
  // console.log(cartBtnLoading);
  return (
    <div className="homepage-main-con" style={{ position: "relative" }}>
      {/* TOPBAR */}
      <Topbar
        localCartTriger={localCartTriger}
        localCartLength={localCartLength}
      />
      {/* BANNER */}

      {products.length < 1 ? (
        <Loader />
      ) : (
        <>
          {/* <AuthGuard> */}

          <Group position="center"></Group>
          <Banner />
          <div className="category-con">{/* <h1>CATEGORIES</h1> */}</div>
          <Advert />
          {/* NEW ARRIVALS */}
          {/* <NewArrivals products={products} /> */}
          {/* <Advert /> */}
          {/* MAIN PRODUCT */}
          <Products products={products} addToCar={addToCar} />
          <Advert />
          {/* SUBSCRIBE */}
          {/* <NewsLetter /> */}
          {/* PROMO */}
          <Promo />
          <Advantages />
          {/* REVIEWS */}
          <Review />
          {/* <Advert /> */}
          {/* FOOTER */}
          <Footer />
          {loginTriger && <Modal setLoginTriger={setLoginTriger} />}
        </>
      )}
    </div>
  );
};
// Homepage.requireAuth = true;

export default Homepage;
