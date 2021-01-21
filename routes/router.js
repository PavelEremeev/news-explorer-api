const router = require('express').Router();
const express = require('express');
const path = require('path');

const { login, createUser } = require('../controllers/user');
const usersRouter = require('../routes/users');
const articleRouter = require('../routes/articles');
const auth = require('../middlewares/auth.js');
const {
  validateUser,
  validateLogin,
} = require('../middlewares/validators');
const NotFoundError = require('../errors/NotFoundError');


router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use(express.static(path.join(__dirname, 'public')));

router.use('/users', auth, usersRouter);
router.use('/articles', auth, articleRouter);

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);
router.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});


module.exports = router