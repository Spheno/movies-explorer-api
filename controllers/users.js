const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUND } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({ email, name, password: hash })
      .then(({ _id }) => res.status(200).send({ email, name, _id }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Переданы некорректные данные при создании пользователя.');
        }
        if (err.name === 'MongoServerError' && err.code === 11000) {
          throw new ConflictError('Пользователь с таким email уже существует');
        }
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.cookie(
        'jwt',
        jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'big-scary-secret', { expiresIn: '7d' }),
        {
          maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
        },
      );
      res.status(200).send({ message: req.cookies.jwt });
    })
    .catch(next);
};

module.exports.logOut = (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      secure: true,
      sameSite: 'none',
    }).send({ message: 'Выход осуществлен' });
  } catch (err) {
    res.status(500).send(err);
  }
  next();
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(({ email, name }) => res.send({ email, name }))
    .catch(() => {
      throw new UnauthorizedError('Необходима авторизацияа');
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user || req.user._id === user.id) {
        User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
          .then((curentUser) => {
            if (curentUser) {
              return res.send({ data: curentUser });
            }
            throw new NotFoundError('Пользователя с таким id не существует');
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new ValidationError('Переданы некорректные данные при обновлении профиля.');
            }
            if (err.name === 'CastError') {
              throw new ValidationError('Неверный Id пользователя');
            }
            next(err);
          })
          .catch(next);
      } else {
        throw new ConflictError('Указанный email принадлежит другому пользователю');
      }
    })
    .catch(next);
};
