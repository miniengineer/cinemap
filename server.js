require("dotenv").config(); //If we have this elsewhere in the app we can remove this
const express = require("express");
const axios = require("axios");
const app = express();

const apikey = process.env.API_KEY;

const setupExpressServer = () => {
  app.get("/api/cinemas/:title", async (req, res) => {
    const { title } = req.params;
    const movieObject = await axios.get(
      `https://api.internationalshowtimes.com/v4/movies?search_query=${title}&search_field=title&apikey=${apikey}`
    );
    //Until we think of a better way to make sure our search criteria matches,
    //I'm just returning the first possible match found.
    if (!movieObject.movies[0]) {
      res.send([]);
    }
    const movieId = movieObject.movies[0].id;
    const showtimesObject = await axios.get(
      `https://api.internationalshowtimes.com/v4/showtimes?countries=JP&movie_id=${movieId}&apikey=${apikey}`
    );
    const allCinemasInJapan = await axios.get(
      `https://api.internationalshowtimes.com/v4/cinemas/?countries=JP&apikey=${apikey}`
    );
    const cinemaIdToNameMap = {};
    allCinemasInJapan.cinemas.forEach(cinema => {
      cinemaIdToNameMap[cinema.id] = {
        cinemaName: cinema.name,
        cinemaId: cinema.id,
        address: cinema.address, //this is an object
        latitude: cinema.location.lat,
        longitude: cinema.longitude.lon
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
};

module.exports = { setupExpressServer };
