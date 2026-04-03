import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 300 * 1000, // 300 * 100 = 5 Minutes
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        "status": "error",
        "message": "Too many requests. Please try again later."
    }
});

export {
    limiter
};