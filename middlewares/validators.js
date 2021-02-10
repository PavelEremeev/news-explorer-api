const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24).hex()
      .required(),
  }).unknown(true),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2).max(30),
    date: Joi.string().required().min(2).max(30),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidation).required(),
    image: Joi.string().custom(urlValidation).required(),
  }),
});

module.exports = {
  validateUser,
  validateArticleId,
  validateLogin,
  validateArticle,
};
