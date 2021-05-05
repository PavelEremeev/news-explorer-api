const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/Error400');
const Error401 = require('../errors/Error401');
const Error409 = require('../errors/Error409');
const { SALT_ROUND, JWT_SECRET, JWT_SECRET_DEV } = require('../configs');

const { NODE_ENV } = process.env;

const getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error400 = new Error400('Неправильный id');
        next(error400);
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      const error409 = new Error409('Юзер с таким емейлом уже есть');
      next(error409);
      return;
    }
    bcrypt.hash(password, SALT_ROUND).then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
      .then((data) => res.send({
        name: data.name,
        email: data.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const errorList = Object.keys(err.errors);
          const messages = errorList.map((item) => err.errors[item].message);
          const error400 = new Error400(`Ошибка валидации: ${messages.join(' ')}`);
          next(error400);
        } else {
          next(err);
        }
      });
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error400 = new Error400('Не введен емейл или пароль');
    next(error400);
    return;
  }
  User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Error401('Неправильный пароль');
    }
    bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        const token = jwt.sign({ id: user._id, email: user.email }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
        res.send({ token });
      } else {
        const error401 = new Error401('Неправильный пароль');
        next(error401);
      }
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      const errorList = Object.keys(err.errors);
      const messages = errorList.map((item) => err.errors[item].message);
      const error400 = new Error400(`Ошибка валидации: ${messages.join(' ')}`);
      next(error400);
    } else {
      next(err);
    }
  });
};

module.exports = {
  getUserMe,
  createUser,
  loginUser,
};
