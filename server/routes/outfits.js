const express = require("express");
const router = express.Router();

// Get a specific user's outfits by id
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  // Validate the user ID (for example, check if it's a valid number)
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Fetch outfits logic (this is just a mock response)
  // Replace this with actual logic to get outfits for the user
  const outfits = [
    { outfitId: 1, name: "Casual", score: 8 },
    { outfitId: 2, name: "Formal", score: 9 },
  ];

  // Send back the outfits in JSON format
  res.json({
    userId,
    outfits,
  });
});

module.exports = router;
