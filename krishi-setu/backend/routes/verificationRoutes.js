const express = require("express");

const {
  verifyAadhaar,
} = require("../controllers/verificationController");

const router = express.Router();

router.post("/aadhaar", verifyAadhaar);

module.exports = router;