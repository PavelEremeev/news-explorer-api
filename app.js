const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const router = require('./routes/router.js');
const { PORT, MONGO_DB_URL } = require('./configs/index.js');

const { requestLogger, errorLogger } = require('./middlewares/logger.js');

const app = express();
const mongoConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false
};

// app.use(limiter);
app.use(helmet());
app.use(requestLogger);
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(MONGO_DB_URL, mongoConnectionOptions);

app.use(router);

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
