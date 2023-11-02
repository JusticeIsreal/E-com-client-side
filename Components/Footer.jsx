// import React from "react";
import Link from "next/link";
import { getSessionUser } from "../Services/functions";
// icopns
import { BsFacebook, BsWhatsapp } from "react-icons/bs";
import { AiFillTwitterCircle, AiTwotoneMail } from "react-icons/ai";
import { FaInstagramSquare } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
function Footer() {
  const router = useRouter();
  // FETCHING SESSION USER NAME AND CART LENGTH
  const [userPosition, setUserPosition] = useState();
  useEffect(() => {
    const userName = async () => {
      const userData = await getSessionUser();
      setUserPosition(userData?.user?.position);
    };
    userName();
  }, [userPosition]);

  // // FETCHING SESSION USER NAME AND CART LENGTH
  const [name, setName] = useState(null);
  const [cartLength, setCartLength] = useState([]);
  const [session, setSession] = useState([]);
  useEffect(() => {
    async function fetchSessionUser() {
      const userData = await getSessionUser();
      if (userData && userData.user) {
        setSession(userData);
        setName(userData?.user?.username);
        setCartLength(userData?.user.cart);
      }
    }
    fetchSessionUser();
  }, [router]);
  // console.log(userPosition);

  // LOGOUT
  const logOUT = () => {
    Cookies.remove("JWTtoken");
    location.reload();
    router.push("/");
    localStorage.removeItem("userLoginDetails");
  };
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Our Location</h3>
          <a href="">
            <i className="fas fa-map-marker-alt"></i> Nigeria
          </a>
        </div>

        <div className="box">
          <h3>Quick Links</h3>
          <Link href="/">
            <i></i> Home
          </Link>
          <Link href="/products">
            <i></i> Products
          </Link>
          <Link href="/orders">
            <i></i> Order
          </Link>
          <a
            href="https://wa.me/+2348036027773?text=Hello, I am a customer on your platfor 'AJIS STORS' and i need your support."
            target="_blank"
          >
            <i></i> surport
          </a>
        </div>

        <div className="box">
          <h3>Extra links</h3>
          <a href="">
            <i></i> privacy policy
          </a>
          <a href="">
            <i></i> payment method
          </a>
          {userPosition === "admin" || userPosition === "staff" ? (
            <Link href="/Adminpage/AdminDashboard">
              <i></i>Admin Login
            </Link>
          ) : (
            ""
          )}{" "}
        </div>

        <div
          className="box"
          // style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
        >
          <h3>contact info</h3>
          <a href="Tel:+2348036027773" target="_blank">
            <i className="fas fa-phone"></i> +2348036027773{" "}
          </a>
          <a href="#">
            <i className="fas fa-envelope"></i>Elegantstorescolection@gmail.com
          </a>
          <div
            style={{
              height: "100%",
            }}
          >
            {name ? (
              <button
                style={{
                  height: "70%",
                  color: "#ff69b4",
                  cursor: "pointer",
                  border: ".1px solid #ff69b4",
                  width: "100px",
                }}
                onClick={() => logOUT()}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/loginpage"
                style={{
                  height: "70%",
                  cursor: "pointer",
                  width: "100px",
                }}
              >
                <button
                  style={{
                    height: "100%",
                    color: "#ff69b4",
                    cursor: "pointer",
                    border: ".1px solid #ff69b4",
                    width: "100px",
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
          <img
            src="/WhatsApp_Image_2023-04-28_at_9.29.11_AM-removebg-preview-removebg-prev.png"
            className="map"
            alt="img"
          />
        </div>
      </div>

      <div className="share">
        <a href="/">
          <BsFacebook />
        </a>
        <a href="/">
          <AiFillTwitterCircle />
        </a>
        <a href="/">
          <FaInstagramSquare />
        </a>
        <a
          href="https://wa.me/+2348036027773?text=Hello, I am a customer on your platfor 'AJIS STORS' and i need your support."
          target="_blank"
        >
          <BsWhatsapp />
        </a>
        <a href="#">
          <AiTwotoneMail />
        </a>
      </div>

      <div className="credit">
        {" "}
        <span>AJIS TECHNOLOGY</span> | copyright &copy;2023 | all rights
        reserved!{" "}
      </div>
    </section>
  );
}

export default Footer;
