const express = require("express");

const {
  getMarketPrice,
} = require("../services/marketPriceService");

const router = express.Router();

router.get("/test", async (req, res) => {
  const commodity = req.query.commodity || "Tomato";

  const records = await getMarketPrice(commodity);

  res.json({
    commodity,
    count: records.length,
    records,
  });
});

module.exports = router;