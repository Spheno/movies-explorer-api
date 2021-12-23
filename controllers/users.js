const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUND, DEV_SECRET } = require('../utils/config');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const {
  conflictErrorText,
  userIdErrorText,
  notFoundUserIdText,
  updateUserErrorText,
  unauthorizedErrorText,
  createUserErrorText,
  logOutMessage,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({ email, name, password: hash })
      .then(({ _id }) => res.status(200).send({ email, name, _id }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError(createUserErrorText));
        }
        if (err.name === 'MongoServerError' && err.code === 11000) {
          next(new ConflictError(conflictErrorText));
        }
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.cookie(
        'jwt',
        jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET, { expiresIn: '7d' }),
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
    }).send({ message: logOutMessage });
  } catch (err) {
    next();
  }
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(({ email, name }) => res.send({ email, name }))
    .catch(() => {
      next(new UnauthorizedError(unauthorizedErrorText));
    });
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
            throw new NotFoundError(notFoundUserIdText);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new ValidationError(updateUserErrorText));
            }
            if (err.name === 'CastError') {
              next(new ValidationError(userIdErrorText));
            }
            next(err);
          });
      } else {
        throw new ConflictError(conflictErrorText);
      }
    })
    .catch(next);
};
