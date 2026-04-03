// ? Config env
import { config } from 'dotenv';

import { start_scraping } from "./scraping/scraping.js";
import express from "express";
import passport_router from "./routes/passports.route.js";
import bodyParser from "body-parser";
import { globalError } from "./middlewares/global_errors.js";
import cors from "cors";

config();

start_scraping();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: "*"
}));

app.use("/", passport_router);

app.all(/.*/, (req, res) => {
  res.status(400).json({
    status: "error",
    message: `Can't find this route: ${req.originalUrl}`
  }); 
});

app.use(globalError);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});