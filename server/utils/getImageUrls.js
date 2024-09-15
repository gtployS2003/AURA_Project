const path = require("path");
const fs = require("fs").promises; // ใช้ promises API ของ fs

const publicDirectory = path.join(__dirname, "../../client/public/images");
const baseUrl = "http://localhost:8080/public/images";

async function getImageUrls(directory, baseUrl) {
  try {
    const files = await fs.readdir(directory); // อ่านไฟล์ใน directory

    // กรองเฉพาะไฟล์ที่เป็นภาพและสร้าง URL ของแต่ละไฟล์
    const imageUrls = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file)) // กรองไฟล์ภาพ
      .map((file) => `${baseUrl}/${file}`); // สร้าง URL สำหรับแต่ละไฟล์

    return imageUrls;
  } catch (err) {
    console.error("Error reading directory:", err);
    throw err;
  }
}

// เรียกใช้ฟังก์ชันและ log ผลลัพธ์
getImageUrls(publicDirectory, baseUrl)
  .then((urls) => console.log(urls)) // แสดงผล URL ที่สร้างได้
  .catch((err) => console.error("Error:", err));
