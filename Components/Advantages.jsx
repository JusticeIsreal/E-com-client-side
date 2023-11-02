import Image from "next/image";
import React from "react";

function Advantages() {
  return (
    <div className="advantage-main-con">
      <div className="advantage-con">
        <div className="advantage-img-con">
          <Image
            src="/undraw_On_the_way_re_swjt.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Fast delivery</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="/undraw_Stripe_payments_re_chlm.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Safe Checkout</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="/undraw_Access_account_re_8spm (1).png"
            alt="img"
            width={50}
            className="img"
            height={50}
          />
          <p>24/7 active</p>
        </div>
        <div className="advantage-img-con">
          <Image
            src="/undraw_shopping_app_flsj.png"
            alt="img"
            width={50}
            height={50}
            className="img"
          />
          <p>Fast delivery</p>
        </div>
      </div>
    </div>
  );
}

export default Advantages;
