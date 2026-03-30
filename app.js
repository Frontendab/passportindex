const { start_scraping } = require("./scraping/scraping");
const express = require("express");
const connect_mongodb = require("./config/db");
const limiter = require("./middlewares/rate_limit");


// ? Config env
require('dotenv').config()

// ? Connect mongodb
connect_mongodb();

const app = express();
const port = process.env.PORT || 3000;

app.use(limiter);

app.get("/", (req, res) => {
  res.status(200).send("Hello world!")
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

start_scraping();