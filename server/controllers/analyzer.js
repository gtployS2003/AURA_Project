const OpenAIApi = require("openai");
const Outfit = require("../model/Outfit.js");
const mongoose = require('mongoose');  // เพิ่มการ import mongoose
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: `${__dirname}/../.env` });

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

const analyzer = async (req, res) => {
  try {
    const selectedstyle = req.body.style;

    // อ่านรูปภาพจากโฟลเดอร์ uploads
    const imageDirectory = path.join(__dirname, '../uploads');
    const imageFiles = fs.readdirSync(imageDirectory);

    const baseUrl = 'http://localhost:3500/uploads';
    const imageUrls = imageFiles.map(file => `${baseUrl}/${file}`);

    // สร้าง JSON ตัวอย่างที่ใช้ในการสร้างชุด
    const formatExample = JSON.stringify([
      {
        "_id": "some_unique_id",
        "outfit_id": 0,
        "clothes": [imageUrls[0], imageUrls[1], imageUrls[2]], 
        "score": 10,
        "considerations": ""
      },
    ]);

    const textContent = `
    นี่คือภาพเสื้อผ้าซึ่งถูกเข้ารหัสในรูปแบบ base64 (${imageUrls}). ฉันต้องการให้คุณสร้างชุดสำหรับผู้หญิงอายุ 25-30 ปี ในสไตล์ ${selectedstyle}. 

    โปรดสร้าง 1 ถึง 5 ชุด โดยแต่ละชุดประกอบด้วย:
    - ส่วนล่าง เช่น กางเกง หรือ กระโปรง
    - ส่วนบน เช่น เสื้อ หรือ เดรส (ซึ่งเป็นทั้งส่วนบนและล่าง)

    ให้คะแนนแต่ละชุดจาก 0 ถึง 10 โดยอธิบายเหตุผลสั้น ๆ ในการให้คะแนนแต่ละชุด และโปรดให้คำแนะนำเพิ่มเติมในการเลือกการแต่งตัวหรือการแต่งหน้า

    ผลลัพธ์ที่ต้องการควรเป็นในรูปแบบ JSON เช่นนี้:
    ${formatExample}
    โปรดให้ข้อมูลในรูปแบบ JSON เท่านั้น โดยไม่ต้องใส่คำอธิบายอื่นเพิ่มเติม
    `;

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

    // ใช้ regex เพื่อค้นหา JSON จากผลลัพธ์ GPT
    const jsonMatch = generatedOutfits.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!jsonMatch) {
      console.error("JSON block not found in GPT response");
      return res.status(500).json({ message: "JSON block not found in GPT response" });
    }

    const jsonContent = jsonMatch[0].trim();

    let parsedOutfits;
    try {
      // ทำความสะอาด JSON เพื่อลบเครื่องหมายหรืออักขระที่ไม่จำเป็น
      const cleanedJsonContent = jsonContent
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/\\n/g, '')
        .replace(/\\t/g, '');

      parsedOutfits = JSON.parse(cleanedJsonContent);
    } catch (err) {
      console.error("Error parsing GPT response:", err.message);
      return res.status(500).json({ message: "Invalid GPT response format" });
    }

    // เพิ่ม ObjectId ให้กับทุกชุด
    const outfitsWithObjectIds = parsedOutfits.map(outfit => {
      return {
        ...outfit,
        _id: new mongoose.Types.ObjectId()  // สร้าง ObjectId ใหม่ให้กับทุกชุด
      };
    });

    // บันทึกข้อมูลหลายชุดลง MongoDB ด้วย insertMany
    await Outfit.insertMany(outfitsWithObjectIds);

    console.log("Outfits saved successfully");

    // ส่งข้อมูลชุดเสื้อผ้ากลับไปยัง client
    return res.status(200).json({
      message: 'Outfits generated and saved successfully',
      outfits: outfitsWithObjectIds,
      images: imageUrls
    });

  } catch (error) {
    console.error("Error in analyzer:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: `Error calling GPT-4 API: ${error.message}` });
    }
  }
};

module.exports = { analyzer };
