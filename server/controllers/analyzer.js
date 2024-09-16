const OpenAIApi = require("openai"); // Import the OpenAI library
const { processImages } = require("./utils/processImages.js");
require("dotenv").config({ path: `${__dirname}/../.env` });
// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

const analyzer = async (req, res) => {
  const selectedstyle = req.body.style;
  const imageUrls = await processImages(req); // imageUrls จะเป็น Base64

  const formatExample = JSON.stringify([
    {
      outfit_id: 0,
      clothes: ["image1", "image2", "image3"],
      score: 10,
      considerations: "",
    },
  ]);

  // แก้ไขข้อความที่ส่งให้ GPT
  const textContent = `นี่คือชุดของภาพที่ถูกเข้ารหัสในรูปแบบ base64 ซึ่งก็คือ ${imageUrls} โดยแต่ละภาพแสดงเสื้อผ้าชิ้นต่าง ๆ ฉันต้องการสร้างชุดหลายชุดสำหรับผู้หญิงอายุ 25-30 ปี ในสไตล์ ${selectedstyle} โดยพิจารณาจากภาพเหล่านี้ เริ่มต้นด้วยการวิเคราะห์ภาพตามสี รูปแบบ เนื้อผ้า จากนั้นให้ทำการผสมและจับคู่เสื้อผ้าเหล่านี้เพื่อสร้างชุด 1-5 ชุด แต่ละชุดควรประกอบด้วยเสื้อผ้า 2-4 ชิ้น

สำหรับแต่ละชุด กรุณาให้รายการที่ประกอบไปด้วย:

ตัวระบุชุด (outfit_id) (สร้างโดยอัตโนมัติ)
รายการ clothes_id ที่คุณเลือกสำหรับชุดนี้ โดย clothes_id คือดัชนีของภาพในรูปแบบ image+index (เริ่มจาก 0)
คะแนนจาก 0 ถึง 10 ที่แสดงถึงความเหมาะสมของชุดกับสไตล์ ${selectedstyle}
คำอธิบายสั้น ๆ เกี่ยวกับเหตุผลในการเลือกชุดนี้
ผลลัพธ์ควรอยู่ในรูปแบบ JSON เช่นนี้ ${formatExample}.`;

  const message = [
    {
      role: "user",
      content: textContent, // ส่งเฉพาะข้อความที่มีภาพใน Base64
    },
  ];

  console.log(JSON.stringify(message));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ยืนยันว่าใช้ GPT-4 หรือ GPT-4 Vision ถ้ารองรับภาพ
      messages: message,
    });
    console.log(response.choices[0]);
    res.status(200).json(response.choices[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error calling GPT-4 API: ${error}` });
  }
};

module.exports = { analyzer };
