import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { TiArrowBack } from "react-icons/ti";
import { checkOut, getSessionUser, registerUser } from "../Services/functions";
import { useRouter } from "next/router";
import { Transaction } from "firebase/firestore";
import Cookies from "js-cookie";

function PayForm({
  product,
  count,
  priceNumber,
  setPayModal,
  productsArray,
  totalAmount,
  sessionUser,
  getUserSession,
  payModal,
}) {
  // login
  const logIN = async (logInGuestUser) => {
    console.log(logInGuestUser);
    axios
      .post("https://jusmin.onrender.com/api/v1/userverification/loginuser", {
        useremail: logInGuestUser.useremail,
        password: logInGuestUser.password,
      })
      .then((resp) => {
        const token = resp.data.data;
        Cookies.set("JWTtoken", token);
        // console.log("login");
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
      });
  };

  // get user session
  const [getUserSessiond, setGetUserSessiond] = useState(false);
  useEffect(() => {
    const getSession = async () => {
      if (getUserSession || sessionUser) {
        setGetUserSessiond(true);
      }
    };
    getSession();
  }, [payModal]);
  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  //   console.log(productsArray);
  const addressRef = useRef("");
  const [productData, setProductData] = useState({});
  const [confirmDetails, setConfirmDetails] = useState({});
  const [showConfirmDetails, setShowConfirmDetails] = useState(false);

  const cartFinalProducts = [];
  useEffect(() => {
    if (!product) {
      for (const p of productsArray) {
        // calculate the total cost
        const newProduct = {
          productname: p.productname,
          productspec: p.productnumber,
          productprice: p.productprice / p.quantity,
          quantity: p.quantity,
        };
        cartFinalProducts.push(newProduct);
        // console.log(cartFinalProducts);
        // add the total cost to the totalAmount variable
      }
    }
  }, []);

  const [paymentBtn, setPaymentBtn] = useState(true);
  const onSubmitBanner = async (data, e) => {
    e.preventDefault();
    setConfirmDetails(data);

    if (product) {
      const dynamicItemDetails = {
        deliveryfee: parseInt(data.state.split(",")[1]),
        homedelivery: parseInt(data.homedelivery),
        anyinfo: data.anyinfo,
        deliveryaddress: `${data.street},${
          data.state.split(",")[0] + " " + "State"
        }`,
        product: [
          {
            productname: product.productname,
            productspec: product.productnumber,
            productprice: parseInt(product.productprice),
            quantity: count,
            clientnote: data.anyinfo,
          },
        ],
      };
      setProductData(dynamicItemDetails);
    } else {
      for (const p of productsArray) {
        // calculate the total cost
        const newProduct = {
          productname: p.productname,
          productspec: p.productnumber,
          productprice: p.productprice / p.quantity,
          quantity: p.quantity,
        };
        cartFinalProducts.push(newProduct);
        // console.log(cartFinalProducts);
        // add the total cost to the totalAmount variable
      }

      const cartItemDetails = {
        deliveryfee: parseInt(data.state.split(",")[1]),
        homedelivery: parseInt(data.homedelivery),
        anyinfo: data.anyinfo,
        deliveryaddress: `${data.street}, ${
          data.state.split(",")[0] + " " + "State"
        }`,
        product: cartFinalProducts,
      };
      setProductData(cartItemDetails);
      // console.log(cartItemDetails);
    }

    // localStorage.setItem("localCartItem", JSON.stringify(localCart));
    if (data.username) {
      const guestUser = {
        username: data.username.toLowerCase() + " " + "(guest)",
        useremail: data.useremail.toLowerCase() + Date.now(),
        position: "guest",
        policy: true,
        userphonenumber: data.userphonenumber,
        password: "guest",
        verified: true,
      };
      localStorage.setItem("userLoginDetails", JSON.stringify(guestUser));

      // register the guest
      setPaymentBtn(false);
      axios
        .post(
          "https://jusmin.onrender.com/api/v1/userverification/registeruser",
          guestUser
        )
        .then((resp) => {
          let userInLocal = localStorage.getItem("userLoginDetails");
          let logInGuestUser = JSON.parse(userInLocal);
          // console.log(resp.data.status);
          localStorage.setItem("userId", resp.data.data.userId);
          if (resp.data.status === "PENDING") {
            logIN(logInGuestUser);
            console.log("logine");
            setPaymentBtn(true);
          }
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setPaymentBtn(false);
        });
    }

    setShowConfirmDetails(true);
  };
  //   console.log(showConfirmDetails);
  // DYNAMIC PAGE ITEM TOTAL
  const total =
    parseInt(confirmDetails?.state?.split(",")[1]) +
    parseInt(confirmDetails.homedelivery) +
    priceNumber;

  // CHECKOUT
  const router = useRouter();
  const [btnStatus, setBtnStatus] = useState(true);

  const checkOutpayment = () => {
    const token = Cookies.get("JWTtoken");
    axios
      .post(
        "https://jusmin.onrender.com/api/v1/transaction/posttransaction",
        productData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const transactionID = {
          transactID: res?.data?.data?.paymentIntent?.id,
          transactionID: res?.data?.data?.Transaction?._id,
        };
        console.log(res.data.data.url);
        localStorage.setItem("transactID", JSON.stringify(transactionID));
        router.push(`${res.data.data.url}`);
      })
      .catch((err) => {
        console.log(err);
      });

    setBtnStatus(false);
  };

  const cancelTransaction = async () => {
    setBtnStatus(false);
    router.push("/");
  };
  // console.log(productData);
  return (
    <div className="modal-main-con">
      <div className="modal-relative">
        <div className="modal-card">
          <button className="go-back" onClick={() => setPayModal(false)}>
            <TiArrowBack />
            Back
          </button>
          {showConfirmDetails && (
            <div className="confirm-form-info">
              <button
                className="go-back"
                onClick={() => setShowConfirmDetails(!showConfirmDetails)}
              >
                <TiArrowBack />
                Back
              </button>
              <h3>Confirm details</h3>
              {product ? (
                <>
                  {" "}
                  <p>
                    Product Name: <span>{product.productname}</span>
                  </p>
                  <p>
                    Product Price:{" "}
                    <span>
                      $ {Number(product?.productprice).toLocaleString()}
                    </span>{" "}
                  </p>
                  <p>
                    Quantity: <span>{count}</span>
                  </p>
                  <p>
                    Delivery fee:
                    <span>
                      {" "}
                      $
                      {(
                        parseInt(confirmDetails?.state?.split(",")[1]) +
                        parseInt(confirmDetails.homedelivery)
                      ).toLocaleString()}{" "}
                      <i>
                        {confirmDetails.homedelivery > 0
                          ? "( Including home delivery service )"
                          : "( No home delivery service )"}
                      </i>
                    </span>
                  </p>
                  <p className="total">
                    Total: <span> $ {total.toLocaleString()}</span>
                  </p>
                  <p>
                    Delivery address:{" "}
                    <span>
                      {confirmDetails?.street},
                      {confirmDetails?.state?.split(",")[0] + " " + "State"}
                    </span>
                  </p>
                  <p>
                    Adiitional info:{" "}
                    <span>
                      {confirmDetails.anyinfo
                        ? `${confirmDetails.anyinfo}`
                        : "No"}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {productsArray.map((item) => (
                    <div key={item.productname + item.productprice}>
                      <p>
                        Product Name: <span>{item.productname}</span>
                      </p>
                      <p>
                        Product Price:{" "}
                        <span>
                          ${" "}
                          {Number(
                            item?.productprice / item.quantity
                          ).toLocaleString()}
                        </span>{" "}
                      </p>
                      <p>
                        Quantity: <span>{item.quantity}</span>
                      </p>

                      <p className="total">
                        Total:{" "}
                        <span>
                         ${" "}
                          {Number(item?.productprice / item.quantity) *
                            item.quantity}
                        </span>
                      </p>
                    </div>
                  ))}
                  <p>
                    Delivery fee:
                    <span>
                      {" "}
                      $
                      {(
                        parseInt(confirmDetails?.state?.split(",")[1]) +
                        parseInt(confirmDetails.homedelivery)
                      ).toLocaleString()}{" "}
                      <i>
                        {confirmDetails.homedelivery > 0
                          ? "( Including home delivery service )"
                          : "( No home delivery service )"}
                      </i>
                    </span>
                  </p>
                  <p>
                    Delivery address:{" "}
                    <span>
                      {confirmDetails?.street},
                      {confirmDetails?.state?.split(",")[0] + " " + "State"}
                    </span>
                  </p>
                  <p>
                    Adiitional info:{" "}
                    <span>
                      {confirmDetails.anyinfo
                        ? `${confirmDetails.anyinfo}`
                        : "No"}
                    </span>
                  </p>
                </>
              )}
              {btnStatus ? (
                <>
                  {paymentBtn && (
                    <div
                      className="checkout-btn"
                      onClick={() => checkOutpayment()}
                    >
                      <button>
                        CHECK OUT (${" "}
                        {product ? (
                          `${total.toLocaleString()}`
                        ) : (
                          <>
                            {" "}
                            {(
                              parseInt(totalAmount) +
                              parseInt(confirmDetails?.state?.split(",")[1]) +
                              parseInt(confirmDetails.homedelivery)
                            ).toLocaleString()}
                          </>
                        )}{" "}
                        )
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="checkout-btn"
                  onClick={() => cancelTransaction()}
                >
                  <button>Loading ...</button>
                </div>
              )}
            </div>
          )}{" "}
          {/* PAYMENT FORM*/}
          <form
            onSubmit={handleSubmit(onSubmitBanner)}
            className="payment-form"
          >
            {/* ADDRESS */}{" "}
            <label ref={addressRef}>Enter delivery details</label>
            {/* STREET */}
            {getUserSessiond ? (
              ""
            ) : (
              <>
                {" "}
                <div>
                  <input
                    type="text"
                    placeholder="Whats's your name ?"
                    {...register("username", { required: true })}
                  />
                  {errors.username && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your name
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Whats's your email address ?"
                    {...register("useremail", { required: true })}
                  />
                  {errors.useremail && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your name
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Whats's your phone number ?"
                    {...register("userphonenumber", { required: true })}
                  />
                  {errors.userphonenumber && (
                    <span
                      className="errror-msg"
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "red",
                      }}
                    >
                      Kindly Enter your phone number
                    </span>
                  )}
                </div>
              </>
            )}{" "}
            {/* ADDRESS */}
            <div>
              <input
                type="text"
                placeholder="Delivery Address"
                {...register("street", { required: true })}
              />
              {errors.street && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter house number and street
                </span>
              )}
            </div>
            {/* STATE */}
            <div>
              <select {...register("state", { required: true })}>
                {product?.productcategory === "Software" ? (
                  <>
                    <option value="">How do u want it</option>
                    <option value="softcopy,500">Via email</option>
                    <option value="google drive,500">Via google drive</option>
                  </>
                ) : (
                  <>
                    {" "}
                    <option value="">Select State</option>
                    <option value="Abuja,3000">Abuja</option>
                    <option value="Abia,2500">Abia</option>
                    <option value="Adamawa,3500">Adamawa</option>
                    <option value="AkwaIbom,2500">Akwa Ibom</option>
                    <option value="Anambra,2500">Anambra</option>
                    <option value="Bauchi,3500">Bauchi</option>
                    <option value="Bayelsa,2500">Bayelsa</option>
                    <option value="Benue,3000">Benue</option>
                    <option value="Borno,4000">Borno</option>
                    <option value="CrossRiver,2500">Cross River</option>
                    <option value="Delta,2500">Delta</option>
                    <option value="Ebonyi,2500">Ebonyi</option>
                    <option value="Edo,2500">Edo</option>
                    <option value="Ekiti,2500">Ekiti</option>
                    <option value="Enugu,2500">Enugu</option>
                    <option value="Gombe,3500">Gombe</option>
                    <option value="Imo,2500">Imo</option>
                    <option value="Jigawa,3500">Jigawa</option>
                    <option value="Kaduna,3500">Kaduna</option>
                    <option value="Kano,3500">Kano</option>
                    <option value="Katsina,3000">Katsina</option>
                    <option value="Kebbi,3500">Kebbi</option>
                    <option value="Kogi,3000">Kogi</option>
                    <option value="Kwara,2500">Kwara</option>
                    <option value="Lagos,2500">Lagos</option>
                    <option value="Niger,4000">Niger</option>
                    <option value="Ogun,2500">Ogun</option>
                    <option value="Ondo,2500">Ondo</option>
                    <option value="Osun,2500">Osun</option>
                    <option value="Oyo,2500">Oyo</option>
                    <option value="Plateau,4000">Plateau</option>
                    <option value="Sokoto,4000">Sokoto</option>
                    <option value="River,2500">River</option>
                    <option value="Taraba,4000">Taraba</option>
                    <option value="Yobe,4000">Yobe</option>
                    <option value="Zamfara,3500">Zamfara</option>
                  </>
                )}{" "}
              </select>
              {errors.state && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter Delivery state
                </span>
              )}
            </div>
            {/* home delivery */}
            <div>
              <select {...register("homedelivery", { required: true })}>
                {product?.productcategory === "Software" ? (
                  <>
                    {" "}
                    <option value="">Operating system</option>
                    <option value="500">Mac</option>
                    <option value="0">Windows</option>
                  </>
                ) : (
                  <>
                    <option value="">Delivery</option>
                    <option value="2000">Yes, home delivery</option>
                    <option value="0">No, I will come pick it </option>
                  </>
                )}
              </select>
              {errors.homedelivery && (
                <span
                  className="errror-msg"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "red",
                  }}
                >
                  Kindly Enter Delivery state
                </span>
              )}
            </div>
            <div>
              <textarea
                // type="text"
                placeholder="Enter any other OPTIONAL information."
                {...register("anyinfo")}
              />
            </div>
            <input
              type="submit"
              className="submit-btn"

              //   value={loadingBanner ? "Uploading..." : "Upload Banner"}
            />
            <img
              src="https://res.cloudinary.com/djtneu2rh/image/upload/v1684191585/WhatsApp_Image_2023-05-15_at_11.59.01_PM-removebg-preview_o2anuk.png"
              alt="img"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default PayForm;
