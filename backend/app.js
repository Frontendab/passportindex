// ? Config env
require('dotenv').config()

const { start_scraping } = require("./scraping/scraping");
const express = require("express");
const connect_mongodb = require("./config/db");
const passport_router = require("./routes/passports.route");
const bodyParser = require("body-parser");
const globalError = require("./middlewares/global_errors");
const cors = require("cors");

// ? Connect mongodb
connect_mongodb();

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