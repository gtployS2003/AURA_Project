import { openDB } from "idb";

// Function to initialize the IndexedDB
async function initDB() {
  const dbName = "WiseWardro";
  const dbVersion = 1;
  try {
    const db = await openDB(dbName, dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(
          `Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`
        );
        // Create "images" store if it doesn't exist
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id" });
        }
        // Create "favorites" store if it doesn't exist
        if (!db.objectStoreNames.contains("favorites")) {
          db.createObjectStore("favorites", { keyPath: "id" });
        }
        // Create "favImages" store if it doesn't exist
        if (!db.objectStoreNames.contains("favImages")) {
          db.createObjectStore("favImages", { keyPath: "id" });
        }
      },
    });
    return db;
  } catch (error) {
    throw new Error(`IndexedDB error: ${error}`);
  }
}

// Function to store images in IndexedDB
async function storeImages(images, formDataKeys) {
  const db = await initDB();
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");

  try {
    for (const [index, image] of images.entries()) {
      const formDataKey = formDataKeys[index]; // Get the corresponding key
      await store.put({ id: formDataKey, blob: image.file }); // Store the File object
    }
    await transaction.done;
  } catch (error) {
    console.error("Error storing images:", error);
  }
}

// Function to store images in the favImages store of IndexedDB
async function storeFavImages(images) {
  const db = await initDB();
  const transaction = db.transaction("favImages", "readwrite");
  const store = transaction.objectStore("favImages");

  try {
    for (const image of images) {
      await store.put(image); // Assuming each image has an 'id' property
    }
    await transaction.done;
  } catch (error) {
    console.error("Error storing favorite images:", error);
  }
}

// Function to retrieve favorite images from IndexedDB
async function getFavImages() {
  const db = await initDB();
  const transaction = db.transaction("favImages", "readonly");
  const store = transaction.objectStore("favImages");
  try {
    const images = await store.getAll();
    const imageUrls = images.map((img) => ({
      id: img.id,
      url: URL.createObjectURL(new Blob([img.blob])),
    }));
    return imageUrls;
  } catch (error) {
    console.error("Error fetching favorite images:", error);
    return [];
  }
}

// Function to retrieve images from IndexedDB
async function getImages() {
  const db = await initDB();
  const transaction = db.transaction("images", "readonly");
  const store = transaction.objectStore("images");
  try {
    const images = await store.getAll();
    const imageUrls = images.map((img) => ({
      id: img.id,
      url: URL.createObjectURL(new Blob([img.blob])),
    }));
    return imageUrls;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

// Function to clear images from IndexedDB
async function clearImages() {
  const db = await initDB();
  const transaction = db.transaction("images", "readwrite");
  const store = transaction.objectStore("images");
  try {
    await store.clear();
    await transaction.done;
    console.log("All images have been cleared from IndexedDB.");
  } catch (error) {
    console.error("Error clearing images:", error);
  }
}

// Function to save an outfit to the favorites store in IndexedDB
async function saveFavoriteOutfit(outfit) {
  const db = await initDB();
  const transaction = db.transaction("favorites", "readwrite");
  const store = transaction.objectStore("favorites");

  const outfitToSave = {
    ...outfit,
    id: outfit.outfit_id,
  };
  delete outfitToSave.outfit_id;

  try {
    await store.put(outfitToSave);
    await transaction.done;
    console.log(`Outfit ${outfitToSave.id} saved successfully.`);
  } catch (error) {
    console.error("Error saving favorite outfit:", error);
  }
}

// Function to remove an outfit from the favorites store in IndexedDB
async function removeFavoriteOutfit(outfitId) {
  const db = await initDB();
  const transaction = db.transaction("favorites", "readwrite");
  const store = transaction.objectStore("favorites");
  try {
    await store.delete(outfitId);
    await transaction.done;
    console.log(`Outfit with id ${outfitId} removed from favorites.`);
  } catch (error) {
    console.error("Error removing favorite outfit:", error);
  }
}

// Function to check if there are images in IndexedDB
async function hasImages() {
  const db = await initDB();
  const transaction = db.transaction("images", "readonly");
  const store = transaction.objectStore("images");
  try {
    const count = await store.count();
    return count > 0;
  } catch (error) {
    console.error("Error checking for images:", error);
    return false;
  }
}

// Function to retrieve all outfits from the favorites store in IndexedDB
async function getFavoriteOutfits() {
  const db = await initDB();
  const transaction = db.transaction("favorites", "readonly");
  const store = transaction.objectStore("favorites");
  try {
    const outfits = await store.getAll();
    return outfits;
  } catch (error) {
    console.error("Error fetching favorite outfits:", error);
    return [];
  }
}

// Function to retrieve image blobs from IndexedDB
async function getImageBlobs() {
  const db = await initDB();
  const transaction = db.transaction("images", "readonly");
  const store = transaction.objectStore("images");
  try {
    const images = await store.getAll();
    return images;
  } catch (error) {
    console.error("Error fetching image blobs:", error);
    return [];
  }
}

export {
  initDB,
  openDB,
  storeImages,
  getImages,
  getImageBlobs,
  hasImages,
  clearImages,
  saveFavoriteOutfit,
  removeFavoriteOutfit,
  getFavoriteOutfits,
  storeFavImages,
  getFavImages,
};
