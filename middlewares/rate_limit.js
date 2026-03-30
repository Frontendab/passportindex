const { rateLimit } = require("express-rate-limit");
const asyncHandler = require("express-async-handler")

// TODO 1): I have to support the rate-limit

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
});

module.exports = limiter;