const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const UnAuthError = require('../errors/UnAuthError');

const { SALT_ROUND, JWT_SECRET} = require('../configs/index.js');

// Авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthError({ message: 'Неправильные email или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnAuthError({ message: 'Неправильные email или пароль' });
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET, { expiresIn: '7d' },
        // eslint-disable-next-line
      );
      res.send({ token });
    })
    .catch(next);

};


// Созданите пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  // смотрим что прилетает
  console.log(req.body);

  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictRequestError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
    })
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  console.log(req.body)
  console.log(req.user);
  User.findOne({ _id: req.user.id })
    .orFail(() => new NotFoundError({ message: 'Нет такого пользователя' }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        throw err;
      }
      throw new BadRequestError({ message: `Некорректные данные: ${err.message}` });
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};
