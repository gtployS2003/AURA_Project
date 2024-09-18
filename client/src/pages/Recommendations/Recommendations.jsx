import React, { useEffect, useState } from "react";
import {
  saveFavoriteOutfit,
  removeFavoriteOutfit,
} from "../../utils/indexDB";
import axios from 'axios';
import "./Recommendations.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";

const Recommendations = ({ style }) => {
  const [favoriteStatus, setFavoriteStatus] = useState({});
  const [error, setError] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [imageUrls, setImageUrls] = useState([]); // เก็บ URL ของรูปภาพทั้งหมดจาก server

  const navigate = useNavigate();
  const location = useLocation();
  const outfitsData = location.state?.outfits; // รับข้อมูล outfits ที่ถูกส่งมาจาก state

  // ฟังก์ชันสำหรับจับคู่ชื่อไฟล์กับ URL ของภาพ
  const getImageUrlByName = (name) => {
    const matchedUrl = imageUrls.find((url) => url.includes(name));
    console.log(`Image for ${name}: ${matchedUrl}`); // ตรวจสอบว่ามีการจับคู่ภาพอย่างถูกต้อง
    return matchedUrl || "path/to/placeholder.png"; // ถ้าไม่มีภาพให้ใช้ fallback image
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/images/list"); // เรียก API เพื่อดึง URL ของภาพ
        console.log("Image URLs fetched:", response.data.images); // ตรวจสอบ URL ของภาพที่ดึงมา
        setImageUrls(response.data.images); // ตั้งค่า URL ของภาพใน state
      } catch (error) {
        console.error("Failed to load images:", error);
        setError("Failed to load images.");
      }
    };
  
    fetchImages();
  }, []);
  

  useEffect(() => {
    console.log("Outfits data received from state: ", outfitsData); // แสดงข้อมูลที่ถูกส่งมาจาก state
    if (outfitsData && Array.isArray(outfitsData) && outfitsData.length > 0) {
      outfitsData.forEach(outfit => console.log("Outfit ID:", outfit._id)); // ตรวจสอบว่า _id มีอยู่
      setOutfits(outfitsData);  // ตั้งค่า outfits จากข้อมูลที่ส่งมา
      setError(""); // ล้าง error ถ้าข้อมูลถูกส่งมาแล้ว
    } else {
      console.error("Outfits data not received correctly or is empty");
      setError("Failed to load outfits.");
    }
  }, [outfitsData]);
  
  // เพิ่ม useEffect เพื่อตรวจสอบการตั้งค่า imageUrls และ outfits
  useEffect(() => {
    console.log("Image URLs:", imageUrls); 
    console.log("Outfits:", outfits);
  }, [imageUrls, outfits]);

  // Toggle favorite status
  const toggleHeart = async (favOutfit) => {
    console.log("Favorite Outfit:", favOutfit);  // ตรวจสอบ favOutfit object
    const currentStatus = favoriteStatus[favOutfit._id];
    const newStatus = { ...favoriteStatus, [favOutfit._id]: !currentStatus };
    setFavoriteStatus(newStatus);
  
    if (!currentStatus) {
      try {
        // ตรวจสอบว่ามีการส่ง outfitId ที่ถูกต้อง
        console.log("Outfit ID to save as favorite:", favOutfit._id);  // ตรวจสอบ _id
        const response = await axios.post("http://localhost:3500/api/outfits/save-favorite", { outfitId: favOutfit._id });
        console.log("Outfit saved as favorite:", response.data);
        setError("");
      } catch (error) {
        console.error("Failed to save your favorite outfit:", error);
        setError("Failed to save your favorite outfit.");
      }
    } else {
      try {
        console.log("Outfit ID to remove from favorite:", favOutfit._id);  // ตรวจสอบ _id
        const response = await axios.delete("http://localhost:3500/api/outfits/remove", { data: { outfitId: favOutfit._id } });
        console.log("Outfit removed from favorites:", response.data);
        setError("");
      } catch (error) {
        console.error("Failed to remove your favorite outfit:", error);
        setError("Failed to remove your favorite outfit, please try again.");
      }
    }
  };
  
  

  if (!outfits.length || !imageUrls.length) {
    console.log("Outfits or images not loaded yet"); // เพิ่มการตรวจสอบการโหลด outfits และ images
    return <div className="outfit__loading">Loading outfits...</div>; 
  }

  return (
    <div className="recommendations">
      <h1 className="outfit-heading">
        Here are some outfit ideas to look {style.toLowerCase()}:
      </h1>
      {error && <div className="error">{error}</div>}

      <div className="outfit-gallery">
        {outfits.map((outfit) => (
          <div key={outfit.outfit_id} className="outfit-card">
            <div className="outfit-card__header">
              <h2 className="outfit-card__text outfit-card__heading">
                Outfit {outfit.outfit_id}
              </h2>
              <div onClick={() => toggleHeart(outfit)}>
                <FontAwesomeIcon
                  className="icon"
                  icon={favoriteStatus[outfit.outfit_id] ? fasHeart : farHeart}
                  style={{ color: favoriteStatus[outfit.outfit_id] ? "pink" : "#5c667e" }}
                />
              </div>
            </div>
            <div className="outfit-card__images">
              {outfit.clothes.map((imageName, idx) => (
                <img
                  className="outfit-card__image"
                  key={idx}
                  src={getImageUrlByName(imageName)} // ใช้ฟังก์ชันจับคู่ URL ของภาพ
                  alt={`Outfit ${outfit.outfit_id}`}
                  onError={(e) => { e.target.src = "path/to/placeholder.png"; }} // Fallback image
                />
              ))}
            </div>
            <p className="outfit-card__text">Score: {outfit.score}</p>
            <p className="outfit-card__text">{outfit.considerations}</p>
          </div>
        ))}
      </div>
      <button className="primary__btn" onClick={() => navigate(-1)}>
        Try New Looks
      </button>
    </div>
  );
}

export default Recommendations;
