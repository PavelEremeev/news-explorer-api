const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { KEY } = require('../utils/config');
const UnauthorizedError = require('../errors/unauthorized-err');
const { BAD_REQUEST_ERR, SUCCESS_LOGIN } = require('../utils/constants');

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(BAD_REQUEST_ERR);
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        KEY,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// module.exports.signin = (req, res, next) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new UnauthorizedError(BAD_REQUEST_ERR);
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new UnauthorizedError(BAD_REQUEST_ERR);
//           }
//           return user;
//         });
//     })
//     .then((user) => {
//       const token = jwt.sign(
//         { id: user._id, email: user.email },
//         KEY, { expiresIn: '7d' },
//         // eslint-disable-next-line
//       );
//       res.send({ token });
//     })
//     .catch(next);
// };