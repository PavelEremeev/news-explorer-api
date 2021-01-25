const router = require('express').Router();

const {
  getMyUser,
} = require('../controllers/user');

// Получение определенного юзера

router.get('/me', getMyUser);

module.exports = router;
