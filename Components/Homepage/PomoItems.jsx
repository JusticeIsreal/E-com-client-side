import { useEffect, useState } from "react";
import Link from "next/link";

// firebase
import { db, storage } from "../../Firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";

function PromoItems({ products }) {

  const [trendingProducts, setTrendingProducts] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "products"),
        where("productclass", "==", "promo")
      ),
      (snapshot) => {
        setTrendingProducts(snapshot.docs);
      }
    );
  }, [db]);
  return (
    <div className="new-arrivals-main-con">
      <div className="new-arrivals-con">
        {/* heading */}
        <h1>Splash Sales</h1>
        {/* product container */}

        <div className="new-products-con">
          {trendingProducts.map((product) => (
            <TrendingProducts
              key={product.id}
              id={product.id}
              productname={product.data().productname}
              productprice={product.data().productprice}
              productoldprice={product.data().productoldprice}
              productimages={product.data().image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromoItems;

function TrendingProducts({
  id,
  productprice,
  productoldprice,
  productimages,
  productname,
}) {
  // percentage of peomo
  const priceDifference =
    parseFloat(productoldprice.toString()) -
    parseFloat(productprice.toString());

  const percentageDifference = Math.floor(
    (priceDifference / parseFloat(productoldprice.toString())) * 100
  );
  return (
    <div className="new-products-case">
      {productoldprice && (
        <p className="percentage-off">
          {percentageDifference}% <br />
          <span>off</span>
        </p>
      )}
      <Link href={`/ClientDynamic/${id}`}>
        <div className="new-products">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={productimages[0]}
              alt="img"
              className="img"
              fill
              sizes="100vw"
            />
          </div>
        </div>
      </Link>
      <h5 className="pname">{productname}</h5>
    </div>
  );
}
