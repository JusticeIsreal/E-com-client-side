import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
// firebase imports
import { db, storage } from "../../Firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { BannerObject } from "../../customtypes";
function BannerForm() {
  // UPLOAD FORM DETAILS TO FIREBASE
  // useform config
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  // BANNER POST
  const bannerFilePickerRef1 = useRef<HTMLInputElement>("" || null);
  const [selectedBanner, setSelectedBanner] = useState("");
  const [imageBase64Banner, setImageBase64Banner] = useState("");
  const [loadingBanner, setLoadingBannr] = useState(false);
  // image 1
  const uploadBannerImg = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "jusmin");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/djtneu2rh/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };
  const addImageToBanner = async (e: ChangeEvent<any>) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = await uploadBannerImg(file);
      setImageBase64Banner(imageUrl);

      const reader = new FileReader();

      reader.onload = (readerEvent: any) => {
        const selectedFile = readerEvent.target.result;
        setSelectedBanner(selectedFile);
      };

      reader.readAsDataURL(file);
    }
  };

  const onSubmitBanner = async (data: any, e: any) => {
    e.preventDefault();
    if (loadingBanner) return;
    setLoadingBannr(true);
    // console.log(data);
    const bannerDetails = {
      ...data,
      timestamp: serverTimestamp(),
      bannerimage: imageBase64Banner,
    };

    try {
      const colRef = collection(db, "banneritems");
      await addDoc(colRef, { ...bannerDetails });
      alert("Banner added successfully!");
    } catch (error) {
      console.error(error);
    }

    reset();
    setLoadingBannr(false);
    setSelectedBanner("");
  };
  return (
    <div className="store-form-container">
      {" "}
      {/* BANNER POST */}
      <form onSubmit={handleSubmit(onSubmitBanner)}>
        {/* BANNER IMAGE*/}
        <label>Banner Image</label>
        <p style={{ fontSize: "12px", fontStyle: "italic", color: "gray" }}>
          <span style={{ color: "red" }}>Note:</span> This images uploaded
          should be{" "}
          <span style={{ fontWeight: "bolder" }}> LandScape Dimension </span>
          with product item aligned to the center
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* IMAGE 1 */}
          <input
            className="file-input"
            type="file"
            placeholder="Enter Product Number"
            ref={bannerFilePickerRef1}
            onChange={addImageToBanner}
          />
          <img
            src={selectedBanner}
            onClick={() => setSelectedBanner("")}
            alt="img"
            style={{ width: "40px", marginBottom: "10px" }}
          />
        </div>
        <input
          type="submit"
          className="submit-btn"
          value={loadingBanner ? "Uploading..." : "Upload Banner"}
        />
      </form>
    </div>
  );
}

export default BannerForm;
