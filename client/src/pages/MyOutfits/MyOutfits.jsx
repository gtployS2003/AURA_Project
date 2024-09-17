import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./MyOutfits.scss";
import removeIcon from "../../asset/close.svg";

function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all saved outfits from MongoDB
    const fetchAllSavedOutfits = async () => {
      try {
        const response = await axios.get(`/api/outfits`);
        console.log("Fetched outfits:", response.data); // ตรวจสอบข้อมูลที่ได้จาก API
        setOutfits(response.data); // ดึงข้อมูล outfits ที่บันทึกไว้ทั้งหมด
      } catch (error) {
        console.error("Failed to fetch saved outfits:", error);
        setError("Failed to load outfits. Please try again.");
      }
    };

    fetchAllSavedOutfits();
  }, []);

  // Handle saving an outfit as favorite
  const handleSaveAsFavorite = async (outfitId) => {
    try {
      console.log("Saving outfit as favorite with outfitId:", outfitId); // ตรวจสอบว่า function ถูกเรียก
  
      // Call API to save outfit as favorite
      const response = await axios.post("/api/outfits/save", { outfitId });
      
      console.log("Response from server:", response.data); // ตรวจสอบ response จาก server
  
      // อัปเดต state หลังจากบันทึกสำเร็จ
      setOutfits((prevOutfits) =>
        prevOutfits.map((outfit) =>
          outfit._id === outfitId ? { ...outfit, favorite: true } : outfit
        )
      );
  
      alert("Outfit saved as favorite!");
      
    } catch (error) {
      console.error("Failed to save outfit as favorite:", error);
      setError("Failed to save the outfit as favorite. Please try again.");
    }
  };
  

  // Handle removing an outfit (เพิ่มฟังก์ชันนี้เพื่อลบชุดออกจาก MongoDB)
  const handleRemoveOutfit = async (outfitId) => {
    try {
      await axios.delete(`/api/outfits/remove`, { data: { outfitId } });
      setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit._id !== outfitId));
    } catch (error) {
      console.error("Failed to remove outfit:", error);
      setError("Failed to remove the outfit. Please try again.");
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!Array.isArray(outfits) || outfits.length === 0) {
    return <p className="no-outfits-message">No outfits saved yet.</p>;
  }

  return (
    <div className="my-outfits">
      <h1 className="outfit-heading">My Outfits</h1>
      <div className="outfit-gallery">
        {outfits.map((outfit) => (
          <div key={outfit._id} className="outfit-card">
            <div className="outfit-card__header">
              <h2 className="outfit-card__text outfit-card__heading">
                Outfit {outfit.outfit_id}
              </h2>
              <img
                src={removeIcon}
                alt="remove button"
                onClick={() => handleRemoveOutfit(outfit._id)} // ใช้ฟังก์ชัน handleRemoveOutfit
                className="icon"
              />
            </div>
            <div className="outfit-card__images">
              {outfit.clothes.map((id, index) => (
                <img
                  className="outfit-card__image"
                  key={index}
                  src={id} 
                  alt={`Outfit ${index}`}
                />
              ))}
            </div>
            <p className="outfit-card__text">Score: {outfit.score}</p>
            <p className="outfit-card__text">{outfit.considerations}</p>

            {outfit.favorite ? (
              <button className="favorite-button" disabled>
                Already a Favorite
              </button>
            ) : (
              <button
                className="favorite-button"
                onClick={() => handleSaveAsFavorite(outfit._id)}
              >
                Save as Favorite
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOutfits;
