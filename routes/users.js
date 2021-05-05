const router = require('express').Router();

const {
  getUserMe,
} = require('../controllers/user');

router.get('/users/me', getUserMe);

module.exports = router;
