import React, { useState, useEffect } from "react";
import "./MyOutfits.scss";
import {
  getFavoriteOutfits,
  removeFavoriteOutfit,
  getFavImages,
} from "../../utils/indexDB";
import removeIcon from "../../asset/close.svg";

function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all outfits saved in the favorites store
    const fetchFavoriteOutfits = async () => {
      try {
        const favoriteOutfits = await getFavoriteOutfits();
        setOutfits(favoriteOutfits);
      } catch (error) {
        console.error("Failed to fetch favorite outfits:", error);
        setError("Failed to load outfits. Please try again.");
      }
    };

    const fetchFavImages = async () => {
      try {
        const favImages = await getFavImages();
        setImages(favImages);
      } catch (error) {
        console.error("Failed to fetch favorite images:", error);
        setError("Failed to load images. Please try again.");
      }
    };

    fetchFavoriteOutfits();
    fetchFavImages();
  }, []);

  // Find the src of images stored in indexDB
  const getImageSrc = (imageId) => {
    const image = images.find((img) => img.id === imageId);
    return image ? image.url : "";
  };

  // Handle removing an outfit
  const handleRemoveOutfit = async (outfitId) => {
    try {
      await removeFavoriteOutfit(outfitId);
      setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit.id !== outfitId));
    } catch (error) {
      console.error("Failed to remove outfit:", error);
      setError("Failed to remove the outfit. Please try again.");
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (outfits.length === 0) {
    return <p className="no-outfits-message">No outfits saved yet.</p>;
  }

  return (
    <div className="my-outfits">
      <h1 className="outfit-heading">My Outfits</h1>
      <div className="outfit-gallery">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="outfit-card">
            <div className="outfit-card__header">
              <h2 className="outfit-card__text outfit-card__heading">
                Outfit {outfit.id}
              </h2>
              <img
                src={removeIcon}
                alt="remove button"
                onClick={() => handleRemoveOutfit(outfit.id)}
                className="icon"
              />
            </div>
            <div className="outfit-card__images">
              {outfit.clothes.map((id) => (
                <div className="outfit-card__images">
                  {outfit.clothes.map((id) => (
                    <img
                      className="outfit-card__image"
                      key={id}
                      src={getImageSrc(id)}
                      alt={`Outfit ${id}`}
                    />
                  ))}
                </div>
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
