// ? Config env
import { config } from 'dotenv';
config();

import requestIp from "request-ip";
import { start_scraping } from "./scraping/scraping.js";
import express from "express";
import passport_router from "./routes/passports.route.js";
import bodyParser from "body-parser";
import { globalError } from "./middlewares/global_errors.js";
import cors from "cors";
import { waitForDB } from './config/db.js';

await waitForDB();
await start_scraping();

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Use the requestIp Middleware to extract the IP
app.use(requestIp.mw());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.ORIGINAL_WEBSITE,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use("/api", passport_router);

app.all(/.*/, (req, res) => {
  res.status(400).json({
    status: "error",
    message: `Can't find this route: ${req.originalUrl}`
  }); 
});

app.use(globalError);

app.listen(port, process.env.IP_SUPPORT, () => {
  console.log(`Server is listening on port ${port}`);
});