const { Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};
const createUserRequest = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const loginUserRequest = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const createArticleRequest = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(urlValidation).required(),
    image: Joi.string().custom(urlValidation).required(),
  }),
};

const deleteArticleRequest = {
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24).hex()
      .required(),
  }).unknown(true),
};

module.exports = {
  createUserRequest,
  loginUserRequest,
  createArticleRequest,
  deleteArticleRequest,
};
