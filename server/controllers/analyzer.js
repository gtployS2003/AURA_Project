const { processImages } = require("./utils/processImages.js");
const OpenAIApi = require("openai");
const Outfit = require("../model/Outfit.js");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: `${__dirname}/../.env` });

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

const analyzer = async (req, res) => {
  try {
    const selectedstyle = req.body.style;

    const imageDirectory = path.join(__dirname, '../uploads'); 
    const imageFiles = fs.readdirSync(imageDirectory);
    
    const baseUrl = 'http://localhost:3500/uploads';
    const imageUrls = imageFiles.map(file => `${baseUrl}/${file}`);

    const formatExample = JSON.stringify([
      {
        outfit_id: 0,
        clothes: [imageUrls[0], imageUrls[1], imageUrls[2]], 
        score: 10,
        considerations: "",
        recommended: ""
      },
    ]);

    const textContent = `นี่คือภาพเสื้อผ้าถูกเข้ารหัสในรูปแบบ base64 (${imageUrls}) ซึ่งแสดงเสื้อผ้าชิ้นต่าง ๆ ฉันต้องการให้คุณสร้างชุดสำหรับผู้หญิงอายุ 25-30 ปี ในสไตล์ ${selectedstyle} โดยเริ่มจากการวิเคราะห์ภาพตามสี รูปแบบ และเนื้อผ้า จากนั้นผสมและจับคู่เสื้อผ้าเหล่านี้เพื่อสร้างชุด 1-5 ชุด แต่ละชุดประกอบด้วยส่วนล่าง (กางเกง, กระโปรง) และส่วนบน (เสื้อ) หรือถ้าเป็นเดรสจะถือว่าเป็นทั้งส่วนล่างและบน ห้ามรวมรองเท้าและเครื่องประดับ ให้คะแนนความเหมาะสมของแต่ละชุดจาก 0 ถึง 10 พร้อมอธิบายเหตุผลสั้น ๆ ในการเลือกชุดนั้น นอกจากนี้ กรุณาให้คำแนะนำในการแต่งตัว การแต่งหน้า และการเลือกเครื่องประดับเพิ่มเติมที่เหมาะสมกับชุดแต่ละชุด ผลลัพธ์ที่ต้องการควรอยู่ในรูปแบบ JSON เช่น ${formatExample}.`;

    const message = [
      {
        role: "user",
        content: textContent,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: message,
    });

    console.log("GPT response received:", JSON.stringify(response, null, 2));

    const generatedOutfits = response.choices[0].message.content;

    // ใช้ regex เพื่อค้นหา JSON
    const jsonMatch = generatedOutfits.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!jsonMatch) {
      console.error("JSON block not found in GPT response");
      return res.status(500).json({ message: "JSON block not found in GPT response" });
    }

    const jsonContent = jsonMatch[0].trim();

    let parsedOutfits;
    try {
      parsedOutfits = JSON.parse(jsonContent);
    } catch (err) {
      console.error("Error parsing GPT response:", err.message);
      return res.status(500).json({ message: "Invalid GPT response format" });
    }

    // Save the generated outfits to MongoDB
    const newOutfit = new Outfit({
      outfit_id: parsedOutfits[0]?.outfit_id || 0,
      style: selectedstyle,
      outfits: parsedOutfits,
      createdAt: new Date(),
    });

    await newOutfit.save();

    // ส่งข้อมูลชุดเสื้อผ้ากลับไปยัง client
    return res.status(200).json({ 
      message: 'Outfit generated and saved successfully', 
      outfits: parsedOutfits, 
      images: imageUrls 
    })

  } catch (error) {
    console.error("Error in analyzer:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: `Error calling GPT-4 API: ${error.message}` });
    }
  } 
};

module.exports = { analyzer };
