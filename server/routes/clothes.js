const express = require("express");
const router = express.Router();
const { formDataValidator } = require("../Middlewares/formDataValidator");
const { analyzer } = require("../controllers/analyzer");
const { saveImages } = require("../Middlewares/saveImages");

router.post("/", formDataValidator, saveImages, analyzer,(req, res) => {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    res.status(200).json({ message: "Request received" });
  });
  
module.exports = router;



