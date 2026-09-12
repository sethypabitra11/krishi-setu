const verifyAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({
        message: "Aadhaar number is required",
      });
    }

    if (aadhaarNumber === "123456789012") {
      return res.json({
        verified: true,
        message: "Aadhaar verification successful",
      });
    }

    return res.status(400).json({
      verified: false,
      message: "Aadhaar verification failed",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Verification server error",
    });
  }
};

module.exports = {
  verifyAadhaar,
};