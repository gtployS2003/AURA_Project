const OpenAIApi = require("openai"); // Import the OpenAI library
const { processImages } = require("./utils/processImages.js");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY}`)

const analyzer = async (req, res) => {
  const selectedstyle = req.body.style;

  // Check if style and files are provided in the request
  if (!selectedstyle || !req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "Style or images are missing from the request." });
  }

  try {
    // Process the images from the request
    const imageUrls = await processImages(req);

    // Check if imageUrls are generated successfully
    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: "No valid images processed." });
    }

    const formatExample = JSON.stringify([
      {
        outfit_id: 0,
        clothes: ["image1", "image2", "image3"],
        score: 10,
        considerations: "",
      },
    ]);

    const textContent = `I have a collection of images encoded in base64, they are ${imageUrls}, each showing a different piece of clothing. I need to create multiple outfits for a 25 to 30-year-old female in a ${selectedstyle} style. Based on these images, first analyze the images based on color, style, texture, then mix and match these clothes to form 1-5 outfits. Each outfit should be a combination of 2 to 4 pieces.\nFor each outfit, provide a list that includes:\n- An outfit identifier (outfit_id) (auto-generated)\n- A list of clothes_id you selected for this outfit, the clothes_id is the 0-based index of the image provided in the collection, in format of image+index\n - A score from 0 to 10, reflecting how well the outfit matches the ${selectedstyle} style.\n - A short description about your rationales for this outfit. Your output should be JSON , in following format\n ${formatExample}.`;

    const message = [
      {
        role: "user",
        content: textContent,
      },
    ];

    // Call the OpenAI API with the structured request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: message,
    });

    if (response && response.choices && response.choices.length > 0) {
      console.log(response.choices[0]);
      res.status(200).json(response.choices[0].message.content);
    } else {
      throw new Error("No valid response from OpenAI API");
    }
    
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: `Error processing request: ${error.message}` });
  }
};

module.exports = { analyzer };
