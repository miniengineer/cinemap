//GET THE DATA SOMEHOW
const {
  getCurrentlyShowingMovies,
  getCinemasShowingMovie
} = require("../utils/utils");

exports.up = function(knex) {
  return knex.schema
    .createTable("movies", t => {
      t.increments().index();
      t.text("title"); //movie_name?
      t.float("imdb_rating");
      t.integer("duration");
      t.text("synopsis");
      t.text("img_url");
    })
    .then(() => {
      //Get all movies currently showing in Tokyo
      //For each of them, populate the table
      return knex("movies").insert(insertMovieData);
    })
    .then(() => {
      return knex.schema.createTable("cinemas", t => {
        t.increments().index();
        t.integer("movie_id");
        t.foreign("movie_id")
          .references("id")
          .inTable("movies");
        t.text("name"); //cinema_name?
        t.text("address");
        t.float("latitude");
        t.float("longitude");
        t.specificType("showtimes", "TEXT[]");
      });
    })
    .then(() => {
      return knex("cinemas").insert(insertShowtimeData);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("cinemas").dropTable("movies");
};
