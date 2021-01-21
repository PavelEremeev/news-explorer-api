const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../configs/index.js')

const UnAuthError = require('../errors/UnAuthError.js');

module.exports = (req, res, next) => {
  let { authorization: token } = req.headers;

  if (!token || !token.startsWith('Bearer ')) {
    throw new UnAuthError({ message: 'Необходима авторизация' });
  }

  token = token.slice('Bearer '.length);

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnAuthError({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  // console.log(req.user);
  next();
};
