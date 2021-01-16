const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const UnAuthError = require('../errors/UnAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
        // eslint-disable-next-line
      );
      res.send({ token });
    })
    .catch(next);

  //   .catch((err) => {
  //   res.status(401).send({ message: err.message })
  // })
  //   .then((user) => {
  //     if (!user) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     } if (user) {
  //       return bcrypt.compare(password, user.password)
  //       .then((matched) => {
  //         // аутентификация успешна
  //         const token = jwt.sign({
  //           _id: user._id
  //         }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'})
  //         if (!matched) {
  //         // хеши не совпали — отклоняем промис
  //         return Promise.reject(new Error('Неправильные почта или пароль'));
  //         }
  //         res.send({ token });
  //       });
  //     }})
  //   .catch(next)
};

// Получения списка всех зарегистрированных пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

// Созданите пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // смотрим что прилетает
  console.log(req.body);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictRequestError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
    })
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(next);
};

module.exports.getOneUser = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params._id)
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

module.exports.getMyUser = (req, res, next) => {
  console.log(req.user);
  User.findById(req.user._id)
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

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.body);
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
      // eslint-disable-next-line
    })
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

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,

    },
  )
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
