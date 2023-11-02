import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fade, Slide } from "react-slideshow-image";
// import { Carousel } from "react-responsive-carousel";

// firebase
import { db, storage } from "../../Firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Loader from "../Loader";

function Banner() {
  // FETCHING BANNER SORTED FROM FIREBABSE
  const [bannerDetails, setBannerDetails] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "banneritems"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setBannerDetails(snapshot?.docs);
      }
    );
  }, [db]);

  return (
    <div className="banner-main-con">
      <div className="content">
        {/* SIAPLAYING PRODUCTS IMAGES*/}
        <div className="carousel-main-con">
          <div className="carousel-con">
            <Fade arrows={false}>
              {bannerDetails?.map((item, index) => (
                <div className="carousel-items-con" key={item.id}>
                  <Image
                    src={item?.data()?.bannerimage}
                    alt="img"
                    className="img"
                    fill
                    sizes="100vw"
                    style={{
                      right: "0",
                    }}
                  />
                </div>
              ))}
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
