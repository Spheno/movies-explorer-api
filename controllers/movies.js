const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверно заполнены данные фильма'));
      }
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с таким id не существует');
      }
      if (movie.owner.toString() === req.user._id) {
        return Movie.deleteOne(movie)
          .then(() => res.send({ data: movie }));
      }
      throw new ForbiddenError('Можно удалять фильмы только из своей библиотеки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Запрашиваемый фильм не найден'));
      }
      next(err);
    });
};
