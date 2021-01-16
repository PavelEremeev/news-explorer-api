require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const auth = require('./middlewares/auth');
const {
  validateUser,
  validateLogin,
} = require('./middlewares/validators');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const { PORT = 3000 } = process.env;
const mongoDbUrl = 'mongodb://localhost:27017/mestodb';
const mongoConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(mongoDbUrl, mongoConnectionOptions);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use(() => {
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

// обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.status !== '500') {
    res.status(err.status).send(err.message);
    return;
  }
  res.status(500).send({ message: `Ошибка на сервере: ${err.message}` });
  next();
});

app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
