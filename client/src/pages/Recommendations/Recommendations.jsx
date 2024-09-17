import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
  getImages,
  storeFavImages,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
} from "../../utils/indexDB";
import "./Recommendations.scss";
import { getJson } from "../../utils/getJson";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

const Recommendations = ({ style, images, response, setResponse }) => {
  const [favoriteStatus, setFavoriteStatus] = useState({}); // State to track favorites
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState([]);

  const navigate = useNavigate();
  const outfits = getJson(response); // Parse JSON string using getJson function

  // Fetch images from IndexedDB
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storedImages = await getImages();
        setImageData(storedImages || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load data.");
      }
    };

    fetchImages();
  }, []);

  // ตรวจสอบจำนวนไฟล์และขนาดไฟล์รวมก่อนส่งคำขอไปยัง API
  const validateImages = () => {
    if (!Array.isArray(images) || images.length < 1 || images.length > 5) {
      setError("Please upload between 1 and 5 images.");
      return false;
    }

    const totalSize = images.reduce((acc, image) => acc + image.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      setError("Total size of images should not exceed 10MB.");
      return false;
    }

    return true;
  };

  // Handle getting recommendations from API
  const handleGetRecommendations = async () => {
    if (!validateImages()) return;

    setLoading(true);
    setError("");
    
    const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3500"; // ตรวจสอบ URL ของ API
    const formData = new FormData();
    formData.append('style', style);
    images.forEach((image, index) => formData.append(`image${index}`, image.file));

    try {
      const response = await axios.post(`${apiUrl}/api/clothes`, formData); // ตรวจสอบ URL ที่ใช้เรียก API
      setResponse(response.data); // Store the response for further use
      setError("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Resource not found.");
      } else {
        setError("Request failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleHeart = async (favOutfit) => {
    const currentStatus = favoriteStatus[favOutfit.outfit_id];
    const newStatus = { ...favoriteStatus, [favOutfit.outfit_id]: !currentStatus };
    setFavoriteStatus(newStatus);

    if (!currentStatus) {
      try {
        const imageFiles = favOutfit.clothes.map((imageID) => getImageFile(imageID));
        await storeFavImages(imageFiles);
        await saveFavoriteOutfit(favOutfit);
        setError("");
      } catch (error) {
        console.error("Failed to save your favorite outfit:", error);
        setError("Failed to save your favorite outfit");
      }
    } else {
      try {
        await removeFavoriteOutfit(favOutfit.outfit_id);
        setError("");
      } catch (error) {
        console.error("Failed to remove your favorite outfit:", error);
        setError("Failed to remove your favorite outfit, please try again");
      }
    }
  };

  // Get image file from IndexedDB
  const getImageFile = (imageId) => {
    const image = imageData.find((img) => img.id === imageId);
    return image ? image : null;
  };

  // Get image source from IndexedDB
  const getImageSrc = (imageId) => {
    const image = imageData.find((img) => img.id === imageId);
    return image ? URL.createObjectURL(image.blob) : "";
  };

  if (loading) {
    return <div className="outfit__loading">Loading...</div>;
  }

  return (
    <div className="recommendations">
      <h1 className="outfit-heading">Here are some outfit ideas to look {style.toLowerCase()}:</h1>
      {error && <div className="error">{error}</div>}
      
      <button className="primary__btn" onClick={handleGetRecommendations}>
        Get Recommendations
      </button>

      <div className="outfit-gallery">
        {Array.isArray(outfits) && outfits.map((outfit) => (
          <div key={outfit.outfit_id} className="outfit-card">
            <div className="outfit-card__header">
              <h2 className="outfit-card__text outfit-card__heading">Outfit {outfit.outfit_id}</h2>
              <div onClick={() => toggleHeart(outfit)}>
                <FontAwesomeIcon
                  className="icon"
                  icon={favoriteStatus[outfit.outfit_id] ? fasHeart : farHeart}
                  style={{ color: favoriteStatus[outfit.outfit_id] ? "pink" : "#5c667e" }}
                />
              </div>
            </div>
            <div className="outfit-card__images">
              {outfit.clothes.map((id) => (
                <img
                  className="outfit-card__image"
                  key={id}
                  src={getImageSrc(id)}
                  alt={`Outfit ${id}`}
                  onError={(e) => { e.target.src = "path/to/placeholder.png"; }} // Fallback image
                />
              ))}
            </div>
            <p className="outfit-card__text">Score: {outfit.score}</p>
            <p className="outfit-card__text">{outfit.considerations}</p>
          </div>
        ))}
      </div>
      <button className="primary__btn" onClick={() => navigate(-1)}>Try New Looks</button>
    </div>
  );
};

export default Recommendations;
