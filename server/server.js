//require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
const { getShowtimeDataByTitle } = require("./utils/utils");

//const imdbApikey = process.env.IMDB_API_KEY;

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

  const dailyWeatherOfTokyoData = weatherOfTokyoData.daily.data;

  const weather = dailyWeatherOfTokyoData.map(day => {
    return {
      time: new Date(day.time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      icon: day.icon
    };
  });
  res.send(weather);
});



app.get("/api/cinemas/:title", async (req, res) => {
  const { title } = req.params;

  //getting movie info from IMDB
  const imdbMoviesResponce = await axios.get(
    `https://imdb8.p.rapidapi.com/title/find?q=${title}`,
    {
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": "cf91a3b741mshf85d2772f4435f3p1664c6jsn35d27acb2132"
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
        "x-rapidapi-key": "cf91a3b741mshf85d2772f4435f3p1664c6jsn35d27acb2132"
      }
    }
  );
  const imdbMovieOverviewData = imdbMovieOverviewResponce.data;
  const imdbDataCollection = {
    movie: imdbMovieOverviewData.title.title,
    duration: imdbMovieOverviewData.title.runningTimeInMinutes,
    image_url: imdbMovieOverviewData.title.image.url,
    rating: imdbMovieOverviewData.ratings.rating,
    summary: imdbMovieOverviewData.plotSummary.text
  };

  //get all showtime data for a movie
  const showtimeData = await getShowtimeDataByTitle(title);
  console.log(showtimeData);

  res.send({ showtimeData, imdbDataCollection });
});
