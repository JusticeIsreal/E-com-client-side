import React, { useEffect, useState } from "react";
import Link from "next/link";
// icon
import { FaMoneyCheck } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/router";
import { getSessionUser, transactionStatus } from "../../Services/functions";
import Loader from "../Loader";
import { BsCheck2All, BsFillPatchCheckFill } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
function Orders({ userTransaction }) {
  const router = useRouter();
  const orderStatus = ["All", "Processing", "Transit", "Delvered"];

  // state for products
  const [products, setProducts] = useState(userTransaction);
  const dynamicBtn = [
    "All",
    ...new Set(userTransaction.map((category) => category?.status)),
  ];
  // state for category
  const [category, setCategory] = useState("All");

  // filter products based on category
  useEffect(() => {
    if (category === "All") {
      setProducts(userTransaction);
    } else {
      setProducts(userTransaction?.filter((item) => item.status === category));
    }
  }, [category, userTransaction, router]);

  // get user
  // const storedRefID = localStorage.getItem("refID");
  // const refID = JSON.parse(storedRefID);
  // useEffect(() => {
  //   const userName = async () => {
  //     await transactionStatus(
  //       refID?.userData,
  //       refID?.transactID
  //       // setGetTransactionDetails
  //     );
  //   };
  //   userName();
  // }, [router, userTransaction]);

  useEffect(() => {
    async function fetchSessionUser() {
      const transactID = localStorage.getItem("transactID")
        ? JSON.parse(localStorage.getItem("transactID"))
        : [];
      // console.log(transactID);
      const userSession = await getSessionUser(router);
      // console.log(userSession);

      const tStatus = await transactionStatus(
        transactID?.transactID,
        transactID?.transactionID
      );
      // console.log(tStatus);
      // if (!userSession) {
      //   return setLoginTriger(true);
      // }
    }
    fetchSessionUser();
  }, [router]);
  return (
    <>
      {products ? (
        <div className="oders-con">
          <div className="order-page-top">
            <h1>TRANSACTIONS</h1>
            <div className="order-status">
              {dynamicBtn.map((btn, index) => (
                <p
                  key={index}
                  className={`${
                    btn === category ? "category active-category" : "category"
                  }`}
                  onClick={() => setCategory(btn)}
                >
                  {btn}
                </p>
              ))}
            </div>
          </div>
          <div className="each-order-con">
            {products.map((order) => (
              <TransactionReceipt key={order._id} {...order} />
            ))}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Orders;

function TransactionReceipt({
  _id,
  timestamp,
  totalAmount,
  status,
  product,

  transactionstatus,
}) {
  // conver time stamp
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const formattedTimestamp = formatDate(timestamp);

  return (
    <Link href={`/ClientDynamic/Reciept/${_id}`}>
      <div className="each-order">
        <div className="order-icon">
          <FaMoneyCheck />
        </div>
        <div className="order-details">
          <p className="timestamp">{formattedTimestamp}</p>
          <p className="productnames">
            {product.map((name) => name.productname.split(" ")[0] + ",  ")}
          </p>
          <p className="productnames" style={{ color: "black" }}>
            {" "}
            $ {totalAmount.toLocaleString()}
          </p>
          <p style={{ color: "gray", fontWeight: "bold" }}>
            Payment:{" "}
            <span
              style={{
                color: (() => {
                  switch (transactionstatus.toLowerCase()) {
                    case "succeeded":
                      return "#2c7a2c";
                    default:
                      return "#db504a";
                  }
                })(),
                fontWeight: "normal",
              }}
            >
              {/* {transactionstatus.toLowerCase()} */}
              {transactionstatus.toLowerCase() === "succeeded" ? (
                <>
                  {transactionstatus.toLowerCase()}
                  <BsCheck2All />
                </>
              ) : (
                <>
                  {transactionstatus.toLowerCase()} <IoIosClose />
                </>
              )}
            </span>
          </p>
        </div>
        <div className="order-payment-status">
          <p style={{ color: "gray" }}>Order</p>
          <p
            style={{
              color: (() => {
                switch (status) {
                  case "Processing":
                    return "#db504a";
                  case "Transit":
                    return "#ffce26";
                  case "Delivered":
                    return "#2c7a2c";
                  default:
                    return "#3d91e6";
                }
              })(),
            }}
          >
            {status}
          </p>
        </div>
      </div>
    </Link>
  );
}
