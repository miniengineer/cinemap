const {
  currentlyShowingMovies,
  getImdbDataForMovie
} = require("../utils/utils");

exports.up = function(knex) {
  return knex.schema
    .createTable("movies", t => {
      t.increments().index();
      t.text("title");
      t.float("rating");
      t.integer("duration");
      t.text("summary");
      t.text("img_url");
    })
    .then(() => {
      console.log(currentlyShowingMovies);
      const insertMovieData = currentlyShowingMovies.map(m => {
        const movieData = getImdbDataForMovie(m);
        return knex("movies").insert({
          title: m,
          rating: movieData.rating,
          duration: movieData.duration,
          summary: movieData.summary,
          img_url: movieData.img_url
        });
      });
      return Promise.all(insertMovieData);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("movies");
};
