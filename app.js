// Declaring var packages
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const movies = require("./movies-data.json");

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(cors());

// API TOKEN VALIDATION FUNCTION
app.use(function validateBearerToken(req, res, next) {
  // declaring vars
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  // auth if statement
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "unauthorized request!" });
  }
  next();
});

// Get movies function
function getMovies(req, res) {
  // declare vars needed for func
  let results = movies;
  let genre = req.query.genre;
  let country = req.query.country;
  let vote = parseFloat(req.query.avg_vote);

  if (genre) {
    results = results.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  if (country) {
    results = results.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (vote) {
    results = results.filter((movie) => movie.avg_vote >= vote);
  }
  res.json(results);
}

app.get("/movie", getMovies);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
