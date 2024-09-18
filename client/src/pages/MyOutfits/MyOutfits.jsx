import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOutfits.scss";
import removeIcon from "../../asset/close.svg";


function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all favorite outfits from MongoDB
    const fetchFavoriteOutfits = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/outfits/favorites");
        console.log("Fetched favorites:", response.data);
        setOutfits(response.data); // เก็บข้อมูลใน state
      } catch (error) {
        console.error("Failed to fetch favorite outfits:", error);
        setError("Failed to load outfits. Please try again.");
      }
    };
  
    fetchFavoriteOutfits();
  }, []);

  // Handle removing an outfit from favorites
  const handleRemoveOutfit = async (outfitId) => {
    try {
      await axios.delete(`http://localhost:3500/api/outfits/remove`, { data: { outfitId } });
      setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit._id !== outfitId));
      alert("Outfit removed successfully!");
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
              {outfit.clothes && outfit.clothes.map((imageUrl, index) => (
                <img
                  className="outfit-card__image"
                  key={index}
                  src={imageUrl} 
                  alt={`Outfit ${index}`}
                />
              ))}
            </div>
            <p className="outfit-card__text">Score: {outfit.score}</p>
            <p className="outfit-card__text">{outfit.considerations}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOutfits;
