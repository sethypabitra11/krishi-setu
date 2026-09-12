const axios = require("axios");

const MARKET_API_URL = `https://api.data.gov.in/resource/${process.env.MARKET_PRICE_RESOURCE_ID}`;

const getMarketPrice = async (commodity) => {
  try {
    const response = await axios.get(MARKET_API_URL, {
      params: {
        "api-key": process.env.DATA_GOV_API_KEY,
        format: "json",
        limit: 10,
      },
    });

    console.log(
      "Total records:",
      response.data.total
    );

    console.log(
      "First records:",
      JSON.stringify(
        response.data.records,
        null,
        2
      )
    );

    return response.data.records || [];
  } catch (error) {
    console.error(
      "Market price API error:",
      error.response?.data || error.message
    );

    return [];
  }
};

module.exports = {
  getMarketPrice,
};