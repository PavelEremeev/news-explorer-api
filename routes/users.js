const router = require('express').Router();

const {
  getMyUser,
} = require('../controllers/users');

const {
  validateUserId,
} = require('../middlewares/validators');


// Получение определенного юзера

router.get('/me', validateUserId, getMyUser);


module.exports = router;
