import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Blockquote } from "@mantine/core";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../Firebase";
const defaultAdImg =
  "https://res.cloudinary.com/isreal/image/upload/v1682609506/E-Commerce%20Project/advert_ehvsy1.png";

function Advert() {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  // FETCHING ADVERT SORTED FROM FIREBABSE
  const [advertDetails, setAdvertDetails] = useState([]);
  const [advertImg, setAdvertImg] = useState([]);
  const [advertLink, setAdvertLink] = useState("");
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "advert"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setAdvertDetails(snapshot.docs);
      }
    );
  }, [db]);
  useEffect(() => {
    setAdvertImg(advertDetails.map((item) => item.data().image));
  }, [db, advertDetails]);

  useEffect(() => {
    setAdvertLink(advertDetails.map((item) => item.data().adlink));
  }, [db, advertDetails]);

  return (
    <div className="ad-con">
      <Carousel
        // withIndicators
        // height={200}
        slideSize="33.333333%"
        slideGap="md"
        dragFree
        loop
        align="start"
        breakpoints={[
          { maxWidth: "md", slideSize: "50%" },
          { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
        ]}
        plugins={[autoplay.current]}
      >
        <Carousel.Slide>
          <div className="ad-img">
            {advertImg.length > 0 ? (
              <a href={"https://" + `${advertLink[0]}`} target="_blank">
                <img
                  src={advertImg[0][0]}
                  alt="add"
                  // style={{ height: "190px" }}
                />
                {/* <h3>HAIR / WIGS</h3> */}
              </a>
            ) : (
              <a
                href="https://wa.me/+2348036027773?text=Hello, I came across your platform and i would like to place an advert."
                target="_blank"
              >
                <img src={defaultAdImg} alt="add" />
              </a>
            )}
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="ad-img">
            {advertImg?.length > 0 ? (
              <a href={"https://" + `${advertLink[0]}`} target="_blank">
                <img
                  src={advertImg[0][1]}
                  alt="add"
                  // style={{ height: "190px" }}
                />
                {/* <h3>NAILS / BEAUTY</h3> */}
              </a>
            ) : (
              <a
                href="https://wa.me/+2348036027773?text=Hello, I came across your platform and i would like to place an advert."
                target="_blank"
              >
                <img src={defaultAdImg} alt="add" />
              </a>
            )}
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="ad-img">
            {advertImg.length > 0 ? (
              <a href={"https://" + `${advertLink[0]}`} target="_blank">
                <img
                  src={advertImg[0][2]}
                  alt="add"
                  // style={{ height: "190px" }}
                />
                {/* <h3>POUCH / ASSOCCERIES</h3> */}
              </a>
            ) : (
              <a
                href="https://wa.me/+2348036027773?text=Hello, I came across your platform and i would like to place an advert."
                target="_blank"
              >
                <img src={defaultAdImg} alt="add" />
              </a>
            )}
          </div>
        </Carousel.Slide>
        <Carousel.Slide>
          <div className="ad-img">
            {advertImg.length > 0 ? (
              <a href={"https://" + `${advertLink[0]}`} target="_blank">
                <img
                  src={advertImg[0][3]}
                  alt="add"
                  // style={{ height: "190px" }}
                />
                {/* <h3>ADULT TOYS</h3> */}
              </a>
            ) : (
              <a
                href="https://wa.me/+2348036027773?text=Hello, I came across your platform and i would like to place an advert."
                target="_blank"
              >
                <img src={defaultAdImg} alt="add" />
              </a>
            )}
          </div>
        </Carousel.Slide>
      </Carousel>
    </div>
  );
}

export default Advert;
