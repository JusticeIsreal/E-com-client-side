import axios from "axios";
import QRCode from "qrcode.react";

import html2canvas from "html2canvas";

import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  transactionStatus,
  singleTransactionFetcher,
  getSessionUser,
} from "../../../Services/functions";
import { TiArrowBack } from "react-icons/ti";
import useSWR from "swr";
import Loader from "../../../Components/Loader";
// const API = "http://localhost:1234/api/v1/transaction/getsingletransaction";
function transactionrecipt() {
  const adminEmail = "jusminempire@gmail.com";
  const router = useRouter();
  const { transactID } = router.query;
  const {
    data: userData,
    isLoading,
    error,
  } = useSWR(transactID ? transactID : null, singleTransactionFetcher);
  console.log(userData);
  // FETCH TRANSACTION STATUS
  console.log(userData);
  useEffect(() => {
    async function fetchSessionUser() {
      if (userData) {
        await transactionStatus(userData && userData, transactID && transactID);
      }
    }
    fetchSessionUser();
  }, [userData, router, transactID]);

  function goBack() {
    router.back();
  }
  // save pae as image
  const saveAsImage = (element) => {
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // get usersession
  const [session, setSession] = useState(false);

  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser(router);
      if (userData) {
        setSession(true);
      }
    }
    fetchSessionUser();
  }, [router]);
  return (
    <div className="receipt-main-con">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="receipt-con">
          <button onClick={goBack} className="go-back">
            <TiArrowBack />
            Back
          </button>
          <h3>Transaction Receipt</h3>
          <p className="paystackRef">
            Order ID: <span>{userData?._id}</span>
          </p>
          <p>
            {userData?.transactionstatus === "Pending"
              ? "Your transation is been proccesed ,once confirmed your order will be approved"
              : `Your transation has been confirmed and your order is currently ${userData?.status}`}
          </p>
          <h4>TRANSACTION</h4>
          <div className="transaction-order-details">
            <p className="item-heading">
              <span className="p-name">Product</span>
              <span className="p-name">Spec</span>
              <span>Price</span>
              <span className="qty">Qty</span>
              <span>Total</span>
            </p>
            {userData?.product.map((item) => (
              <div key={item._id} className="product-details">
                <span className="p-name">{item?.productname}</span>
                <span className="p-name">{item?.productspec}</span>
                <span>$ {item?.productprice.toLocaleString()}</span>
                <span className="qty"> {item?.quantity}</span>
                <span>$ {item?.total.toLocaleString()}</span>
              </div>
            ))}
            <div
              className="transaction-status"
              style={{
                width: "95%",
                marginTop: "10px",
                borderTop: "1px dashed gray",
              }}
            >
              <span>Delivery fee:</span>
              <span>$ {userData?.deliveryfee}</span>
            </div>
            <div className="transaction-status" style={{ width: "95%" }}>
              <span>Home delivery:</span>
              <span>
                $ {userData?.homedelivery ? userData.homedelivery : "No"}
              </span>
            </div>
            <div
              className="transaction-status first"
              style={{ width: "95%", borderTop: "1px dashed gray" }}
            >
              <span>Transaction status:</span>
              <span
                style={{
                  color: (() => {
                    switch (userData?.transactionstatus.toLowerCase()) {
                      case "succeeded":
                        return "#2c7a2c";
                      default:
                        return "#db504a";
                    }
                  })(),
                }}
              >
                {userData?.transactionstatus.toLowerCase()}
              </span>
            </div>
            <div className="transaction-status" style={{ width: "95%" }}>
              <span>Order status:</span>
              <span
                style={{
                  color: (() => {
                    switch (userData?.status) {
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
                {" "}
                {userData?.status}
              </span>
            </div>
            <div className="transaction-status" style={{ width: "95%" }}>
              <span>Date / Time:</span>
              <span> {userData?.timestamp.substring(0, 20).toString()}</span>
            </div>
            <div className="transaction-status" style={{ width: "95%" }}>
              <span>Delivery address:</span>
              <span> {userData?.deliveryaddress}</span>
            </div>
            <div className="transaction-status" style={{ width: "95%" }}>
              <span>Admin note:</span>
              <span>{userData?.adminnote}</span>
            </div>
            <div className="total-amount">
              <h1>$ {userData?.totalAmount.toLocaleString()}</h1>
            </div>
            <div className="qr-code">
              <QRCode
                value={`https://jusmin.vercel.app/Adminpage/transaction/${
                  transactID && transactID
                }`}
              />
            </div>
          </div>

          <div className="download-page">
            <p onClick={() => saveAsImage(document.body)}>Print page</p>
            <a href={`mailto:${adminEmail}`} target="_blank">
              {" "}
              <p>Make a report</p>
            </a>
          </div>
        </div>
      )}{" "}
    </div>
  );
}

export default transactionrecipt;
