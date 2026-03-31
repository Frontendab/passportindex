const express = require("express");
const router = express.Router();
const limiter = require("../middlewares/rate_limit");
const { 
    get_nationalities, get_passports,
    get_passport_by_id, get_map_data
} = require("../controllers/passports.controller");
const VerifyRecaptcha = require("../middlewares/recaptcha");    

router.get("/nationalities", get_nationalities);

router.post("/nationalities/:id", limiter, VerifyRecaptcha, get_map_data);

router.get("/passports", get_passports);

router.get("/passports/:id", get_passport_by_id);

module.exports = router;