const express = require("express");
const router = express.Router();
const { formDataValidator } = require("../Middlewares/formDataValidator");
const { analyzer } = require("../controllers/analyzer");
const { saveImages } = require("../Middlewares/saveImages");

// ตรวจสอบการ import และการใช้งานฟังก์ชันใน route นี้
router.post("/", formDataValidator, saveImages, analyzer);

module.exports = router;