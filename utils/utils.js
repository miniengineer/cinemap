const axios = require("axios");
require("dotenv").config();

const apikey = process.env.API_KEY;
const imdbApikey = process.env.IMDB_API_KEY;

const getCurrentlyShowingMovies = async () => {
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
  return filteredCurrentlyShowingResponse;
};

const getCinemasShowingMovie = async (m) => {
  const moviesResponse = await axios.get(
    `https://api.internationalshowtimes.com/v4/movies?search_query=${m}&search_field=title&apikey=${apikey}`
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

  const cinemaResponseObject = {};
  showtimesObject.showtimes.forEach(showtime => {
    if (!cinemaResponseObject[showtime.cinema_id]) {
      cinemaResponseObject[showtime.cinema_id] = {
        cinema_name: cinemaIdToNameMap[showtime.cinema_id].cinemaName,
        cinema_id: showtime.cinema_id,
        movie_name: m,
        movie_id,
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
  return tokyoCinemas;
};

const getImdbDataForMovie = async title => {
  const imdbMoviesResponse = await axios.get(
    `https://imdb8.p.rapidapi.com/title/find?q=${title}`,
    {
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": `${imdbApikey}`
      }
    }
  );
  const imdbMovieData = imdbMoviesResponse.data;
  const imdbMovieId = imdbMovieData.results[0].id.slice(7, 16);
  const imdbMovieOverviewResponse = await axios.get(
    `https://imdb8.p.rapidapi.com/title/get-overview-details?currentCountry=US&tconst=${imdbMovieId}`,
    {
      headers: {
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
        "x-rapidapi-key": `${imdbApikey}`
      }
    }
  );
  const imdbMovieOverviewData = imdbMovieOverviewResponse.data;
  const imdbDataCollection = {
    duration: imdbMovieOverviewData.title.runningTimeInMinutes,
    image_url: imdbMovieOverviewData.title.image.url,
    rating: imdbMovieOverviewData.ratings.rating,
    summary: imdbMovieOverviewData.plotSummary.text
  };

  return imdbDataCollection;
};


module.exports = {
  getCinemasShowingMovie,
  getCurrentlyShowingMovies,
  getImdbDataForMovie
}
