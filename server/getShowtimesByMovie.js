module.exports = async (knex, title) => {
  const movieInfo = await knex('movies').where({ title }).select();
  const movieId = movieInfo.id;
  const cinemaInfo = await knex('cinemas').where({ movie_id: movieId }).select();
  return { movieInfo, cinemaInfo };
}
