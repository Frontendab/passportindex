import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 30 requests within windowMs
    keyGenerator: (req, res) => {
        // Use req.clientIp provided by requestIp.mw()
        return req.clientIp;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        "status": "error",
        "message": "You have exceeded your request limit. Please try again later."
    }
});

export {
    limiter
};