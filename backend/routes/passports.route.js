import express from "express";
const router = express.Router();
import { limiter } from "../middlewares/rate_limit.js";
import { 
    get_nationalities,
    get_passport_by_id, get_map_data
} from "../controllers/passports.controller.js";
import { VerifyRecaptcha } from "../middlewares/recaptcha.js";    

router.get("/nationalities", get_nationalities);

router.post("/nationalities/:id", limiter, VerifyRecaptcha, get_map_data);

router.get("/passports/:id", get_passport_by_id);

export default router;