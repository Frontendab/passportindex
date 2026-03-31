const asyncHandler = require("express-async-handler");
const axios = require("axios");


const VerifyRecaptcha = asyncHandler(async(req, res, next) => {
    if (!req.body?.captcha)
        return res.status(400).json({
            status: "error",
            message: "Please complete the CAPTCHA.",
        });

    const secretKey = process.env.SECRET_KEY_RECAPTCHA;

    try {
        const response = await axios.post(
            `${process.env.GOOGLE_API_URL}?secret=${secretKey}&response=${captcha}`
        );

        if (response.data.success)
            next();
        else return res.status(400).json({
            status: "error",
            message: "CAPTCHA verification failed."
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "CAPTCHA verification error."
        })
    }
});

module.exports = VerifyRecaptcha;