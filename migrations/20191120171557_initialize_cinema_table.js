const cinemasShowingMovie = require("../utils/utils");

exports.up = function(knex) {
  return knex.schema
    .createTable("cinemas", t => {
      t.increments().index();
      t.integer("movie_id");
      t.foreign("movie_id")
        .references("id")
        .inTable("movies");
      t.text("cinema_name");
      t.text("address");
      t.float("latitude");
      t.float("longitude");
      t.specificType("showtimes", "TEXT[]");
    })
    .then(() => {
      cinemasShowingMovie.map(cinema => {
        const movie_id = knex("movies")
          .where({ title: cinema.movie_name })
          .select("id");
        return knex("cinemas").insert({
          cinema_name: cinema.cinema_name,
          movie_id,
          movie_name: cinema.movie_name,
          address: cinema.address,
          latitude: cinema.latitude,
          longitude: cinema.longitude,
          showtimes: cinema.showtimes
        });
      });
      return knex("cinemas").insert(insertCinemaData);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable("cinemas");
};
