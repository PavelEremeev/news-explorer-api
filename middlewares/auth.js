const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnAuthError = require('../errors/UnAuthError.js');

module.exports = (req, res, next) => {
  let { authorization: token } = req.headers;

  if (!token || !token.startsWith('Bearer ')) {
    throw new UnAuthError({ message: 'Необходима авторизация' });
  }

  token = token.slice('Bearer '.length);

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnAuthError({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  // console.log(req.user);
  next();
};

// const extractBearerToken = (header) => {=
//   return header.replace('Bearer ', '');
// };

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return handleAuthError(res);
//   }

//   const token = extractBearerToken(authorization);
//   let payload;

//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     return handleAuthError(res);
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса
//   console.log(req.user)
//   next(); // пропускаем запрос дальше
// };
