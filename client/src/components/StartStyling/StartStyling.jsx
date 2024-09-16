import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hasImages, clearImages, storeImages } from "../../utils/indexDB";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const StartStyling = ({ style, setStyle, response, setResponse, images, gender }) => {
  const [errors, setErrors] = useState({});
  const [request, setRequest] = useState(false); // the loading state
  const [apiCallFinished, setApiCallFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const base_url = process.env.REACT_APP_BASE_URL || "http://localhost:3001"; // Default base URL
  const navigate = useNavigate();

  const styles = [
    "Streetwear",
    "Boho-chic",
    "Casual",
    "Business Casual",
    "Formal",
    "Minimalist",
    "Elegant",
    "Athleisure",
    "Girly girl",
    "NYC Style",
    "Preppy Fashion",
    "Punk Fashion",
    "Gothic Fashion",
  ];

  // Clear out the old images stored in indexDB upon reload of this page
  useEffect(() => {
    const clearDatabase = async () => {
      try {
        const ImagesStoreHasData = await hasImages();
        if (!ImagesStoreHasData) return;
        await clearImages();
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          db: "Failed to clear history images, please try again",
        }));
      }
    };
    clearDatabase();
  }, []);

  // Navigate when API call is finished
  useEffect(() => {
    if (apiCallFinished && Array.isArray(response) && response.length > 0) {
      navigate("/recommendations");
      setApiCallFinished(false); // Reset the flag after navigating
    }
  }, [apiCallFinished]);

  // Handle style selection
  const handleStyleClick = (style) => {
    setStyle(style);
  };

  // Handle form submission (for uploading images and style)
  const handleSubmit = async () => {
    const formData = new FormData();

    // ตรวจสอบว่ามีการเลือกสไตล์หรือไม่
    if (!style) {
      setError("Please select a style before submitting.");
      return;
    }

    // ตรวจสอบว่ามีการอัปโหลดรูปภาพอย่างน้อย 1 รูป
    if (!Array.isArray(images) || images.length === 0) {
      setError("Please upload at least 1 image.");
      return;
    }

    console.log("Selected Style:", style);
    images.forEach((image, index) => {
      console.log(`Image ${index}:`, image.file);
      formData.append(`image${index}`, image.file);
    });

    // เพิ่มรูปภาพลงใน FormData
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);  // ใช้ image.file เพื่อเข้าถึงไฟล์
    });

    // เพิ่มสไตล์และเพศลงใน FormData
    formData.append("style", style);
    formData.append("gender", gender);  // เพิ่มค่าเพศลงใน formData

    try {
      const apiResponse = await axios.post(`${base_url}/api/clothes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", apiResponse.data);
      setResponse(apiResponse.data.message.content);  // ใช้การตอบสนองที่ได้จาก API
    } catch (error) {
      console.error("Error in sending request:", error);
      setError("Request failed. Please try again.");
    }
  };

  // Handle API call for styling
  const handleClick = async () => {
    const errors = {};
    if (!style) {
      errors.style = "Please select a style for your outfit";
    }
    if (!Array.isArray(images) || images.length < 3) {
      errors.images = "Please upload at least 3 images";
    }
    if (errors.images || errors.style) {
      setErrors(errors);
      return;
    }

    setRequest(true);
    setErrors({}); // Clear previous errors

    const formData = new FormData();
    const formDataKeys = [];
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
      formDataKeys.push(`image${index}`);
    });
    formData.append("style", style);
    formData.append("gender", gender);  // เพิ่มเพศลงใน formData

    try {
      await storeImages(images, formDataKeys); // Store images in IndexedDB

      const apiResponse = await axios.post(`${base_url}/api/clothes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(apiResponse.data.message.content);
      setRequest(false);
      setApiCallFinished(true);
    } catch (error) {
      console.error("Error in sending request:", error);
      setErrors({ api: `${error.message}. Please try again.` });
    }
  };

  return (
    <div className="style">
      <div className="style__options">
        {styles.map((s) => (
          <button
            key={s}
            className={`style__option ${s === style ? "style__option--selected" : ""
              }`}
            onClick={() => handleStyleClick(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {!request && (
        <button className="style__btn" onClick={handleClick}>
          Ask Advisor
        </button>
      )}
      {request && (
        <Box className="style__loading" sx={{ display: "flex" }}>
          <CircularProgress sx={{ color: "black" }} />
        </Box>
      )}
      <div className="style__errors">
        {errors.images && <p className="error">{errors.images}</p>}
        {errors.style && <p className="error">{errors.style}</p>}
        {errors.api && <p className="error">{errors.api}</p>}
        {errors.db && <p className="error">{errors.db}</p>}
      </div>
    </div>
  );
};

export default StartStyling;
