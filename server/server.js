const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
require("dotenv").config();

const apikey = process.env.API_KEY;

app.use(express.static(path.join(__dirname, "..", "build")));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

app.get("/api/cinemas/:title", async (req, res) => {
  const { title } = req.params;
  const moviesResponce = await axios.get(
    `https://api.internationalshowtimes.com/v4/movies?search_query=${title}&search_field=title&apikey=${apikey}`
  );
  const movieObject = moviesResponce.data;
  //Until we think of a better way to make sure our search criteria matches,
  //I'm just returning the first possible match found.
  if (!movieObject.movies[0]) {
    res.send([]);
  }
  const movieId = movieObject.movies[0].id;
  const showtimesResponce = await axios.get(
    `https://api.internationalshowtimes.com/v4/showtimes?countries=JP&movie_id=${movieId}&apikey=${apikey}`
  );
  const showtimesObject = showtimesResponce.data;
  const allCinemasResponce = await axios.get(
    `https://api.internationalshowtimes.com/v4/cinemas/?countries=JP&apikey=${apikey}`
  );
  const allCinemasInJapan = allCinemasResponce.data;
  const cinemaIdToNameMap = {};
  console.log({ allCinemasInJapan });
  allCinemasInJapan.cinemas.forEach(cinema => {
    console.log({ cinema });
    cinemaIdToNameMap[cinema.id] = {
      cinemaName: cinema.name,
      cinemaId: cinema.id,
      address: cinema.location.address, //this is an object
      latitude: cinema.location.lat,
      longitude: cinema.location.lon
    };
  });
  const cinemaResponseObject = {};
  showtimesObject.showtimes.forEach(showtime => {
    if (!cinemaResponseObject[showtime.cinema_id]) {
      cinemaResponseObject[showtime.cinema_id] = {
        cinemaName: cinemaIdToNameMap[showtime.cinema_id].name,
        cinemaId: showtime.cinema_id,
        movieName: title,
        movieId,
        address: cinemaIdToNameMap[showtime.cinema_id].address, //this is an object
        latitude: cinemaIdToNameMap[showtime.cinema_id].location.lat,
        longitude: cinemaIdToNameMap[showtime.cinema_id].location.lon,
        showtimes: [showtime.start_at]
      };
    } else {
      cinemaResponseObject[showtime.cinema_id].showtimes.push(
        showtime.start_at
      );
    }
  });
  res.send(cinemaResponseObject);
});

