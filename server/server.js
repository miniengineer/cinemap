const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
require("dotenv").config();

const apikey = process.env.API_KEY;
const imdbApikey = process.env.IMDB_API_KEY;

app.use(express.static(path.join(__dirname, "..", "build")));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

app.get("/api/weather", async (req, res) => {
  const weatherOfTokyoResponse = await axios.get(
    `https://dark-sky.p.rapidapi.com/35.6804,139.7690?lang=en&units=auto`,
    {
      headers: {
        "x-rapidapi-host": "dark-sky.p.rapidapi.com",
        "x-rapidapi-key": `${imdbApikey}`
      }
    }
  );
  const weatherOfTokyoData = weatherOfTokyoResponse.data;
  console.log(weatherOfTokyoData);

  const dailyWeatherOfTokyoData = weatherOfTokyoData.daily.data;

  const weather = dailyWeatherOfTokyoData.map(day => {
  return {
    time: new Date(day.time).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    }),
    icon: day.icon
    };
  })
  res.send(weather);
});

app.get("/api/currently-showing", async (req, res) => {
  const tokyoWardIds =
    "21985,21990,21995,22003,22043,22045,22047,22062,22067,22038,22005,22157,22159,22224,22039,22262,22227,22103,22232,22180";
  const tokyoShowtimesResponse = await axios.get(
    `https://api.internationalshowtimes.com/v4/showtimes?city_ids=${tokyoWardIds}&apikey=${apikey}`
  );
  const currentlyShowingMovieIds = [];
  tokyoShowtimesResponse.data.showtimes.forEach(showtime => {
    if (!currentlyShowingMovieIds.includes(showtime.movie_id)) {
      currentlyShowingMovieIds.push(showtime.movie_id);
    }
  });
  const filteredMovieIds = currentlyShowingMovieIds.filter(id => id !== null);
  const currentlyShowingMovieTitles = filteredMovieIds.map(async id => {
    const movieResponse = await axios.get(
      `https://api.internationalshowtimes.com/v4/movies/${id}?apikey=${apikey}`
    );
    return movieResponse.data.movie.title;
  });
  const currentlyShowingResponse = await Promise.all(
    currentlyShowingMovieTitles
  );
  const filteredCurrentlyShowingResponse = currentlyShowingResponse.filter(
    title => title !== null
  );
  res.send(filteredCurrentlyShowingResponse);
});

app.get("/api/cinemas/:title", async (req, res) => {
  const { title } = req.params;
  const moviesResponse = await axios.get(
    `https://api.internationalshowtimes.com/v4/movies?search_query=${title}&search_field=title&apikey=${apikey}`
  );
  const movieObject = moviesResponse.data;
  //Until we think of a better way to make sure our search criteria matches,
  //I'm just returning the first possible match found.
  if (!movieObject.movies[0]) {
    res.send([]);
  }
  const movieId = movieObject.movies[0].id;
  //optimized API calls, faster by 3 seconds
  const responses = await Promise.all([
    axios.get(
      `https://api.internationalshowtimes.com/v4/showtimes?countries=JP&movie_id=${movieId}&apikey=${apikey}`
    ),
    axios.get(
      `https://api.internationalshowtimes.com/v4/cinemas/?countries=JP&apikey=${apikey}`
    )
  ]);
  const showtimesObject = responses[0].data;
  const allCinemasInJapan = responses[1].data;
  const cinemaIdToNameMap = {};
  allCinemasInJapan.cinemas.forEach(cinema => {
    cinemaIdToNameMap[cinema.id] = {
      cinemaName: cinema.name,
      cinemaId: cinema.id,
      location: cinema.location //this is an object
    };
  });

  const imdbMoviesResponce = await axios.get(
    `https://imdb8.p.rapidapi.com/title/find?q=${title}`,
    {
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": `${imdbApikey}`
      }
    }
  );
  const imdbMovieData = imdbMoviesResponce.data;
  const imdbMovieId = imdbMovieData.results[0].id.slice(7, 16);
  const imdbMovieOverviewResponce = await axios.get(
    `https://imdb8.p.rapidapi.com/title/get-overview-details?currentCountry=US&tconst=${imdbMovieId}`,
    {
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": `${imdbApikey}`
      }
    }
  );
  const imdbMovieOverviewData = imdbMovieOverviewResponce.data;
  const imdbDataCollection = {
    duration: imdbMovieOverviewData.title.runningTimeInMinutes,
    image_url: imdbMovieOverviewData.title.image.url,
    rating: imdbMovieOverviewData.ratings.rating,
    summary: imdbMovieOverviewData.plotSummary.text
  };

  const cinemaResponseObject = {};
  showtimesObject.showtimes.forEach(showtime => {
    if (!cinemaResponseObject[showtime.cinema_id]) {
      cinemaResponseObject[showtime.cinema_id] = {
        cinemaName: cinemaIdToNameMap[showtime.cinema_id].cinemaName,
        cinemaId: showtime.cinema_id,
        movieName: title,
        movieId,
        address: cinemaIdToNameMap[showtime.cinema_id].location.address, //this is an object
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
  let tokyoCinemas = Object.entries(cinemaResponseObject);
  tokyoCinemas = tokyoCinemas.filter(
    cinemaArr => cinemaArr[1].address.state === "Tokyo"
  );
  res.send({ tokyoCinemas, imdbDataCollection });
});
