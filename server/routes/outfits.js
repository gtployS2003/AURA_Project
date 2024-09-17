const express = require("express");
const router = express.Router();
const Outfit = require("../model/Outfit.js"); // Import MongoDB model

// Get all saved outfits for a specific user by userId
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  // Validate the user ID (check if it's a valid ObjectId)
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Fetch outfits from MongoDB based on the userId
    const outfits = await Outfit.find({ userId });

    if (!outfits || outfits.length === 0) {
      return res.status(404).json({ message: "No outfits found for this user" });
    }

    // Send back the outfits in JSON format
    res.json({
      userId,
      outfits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving outfits" });
  }
});

// Save a favorite outfit for a user
router.post("/save", async (req, res) => {
  const { userId, outfitId, outfitData } = req.body;

  // Validate input data
  if (!userId || !outfitId || !outfitData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find the outfit in the database and update it with the favorite tag
    const outfit = await Outfit.findOneAndUpdate(
      { userId, "outfits.outfit_id": outfitId },
      { $set: { "outfits.$.favorite": true } }, // Set the favorite field to true
      { new: true }
    );

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    res.json({ message: "Outfit saved as favorite", outfit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving outfit as favorite" });
  }
});

module.exports = router;
