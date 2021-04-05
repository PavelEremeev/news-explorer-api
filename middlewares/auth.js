const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_SECRET_DEV } = require('../configs');

const { NODE_ENV } = process.env;
const Error401 = require('../errors/Error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    const error401 = new Error401('Необходима авторизация');
    next(error401);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    const error401 = new Error401('Необходима авторизация');
    next(error401);
  }

  req.user = payload;

  next();
};
