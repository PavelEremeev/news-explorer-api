require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors, celebrate } = require('celebrate');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const { MONGO_BASE_DEV, MONGO_BASE } = require('./configs');

const { NODE_ENV } = process.env;
const userRoutes = require('./routes/users.js');
const articleRoutes = require('./routes/articles.js');
const Error404 = require('./errors/Error404');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');
const { createUserRequest, loginUserRequest } = require('./middlewares/request-validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, loginUser } = require('./controllers/user');

mongoose.connect(NODE_ENV === 'production' ? MONGO_BASE : MONGO_BASE_DEV, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(requestLogger);
app.use(limiter);

router.use('*', (req, res, next) => {
  const error404 = new Error404('Запрашиваемый ресурс не найден');
  next(error404);
});

app.post('/signin', celebrate(loginUserRequest), loginUser);
app.post('/signup', celebrate(createUserRequest), createUser);

app.use('/', auth, userRoutes);
app.use('/', auth, articleRoutes);
app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
