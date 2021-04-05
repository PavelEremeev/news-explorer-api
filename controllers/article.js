const Article = require('../models/article');
const Error400 = require('../errors/Error400');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

const getArticles = (req, res, next) => {
  const { id } = req.user;
  Article.find({ owner: id })
    .then((articles) => res.status(200).send(articles))
    .catch((err) => next(err));
};

const deleteArticleById = (req, res, next) => {
  const { articleId } = req.params;
  const { id } = req.user;
  Article.findOne({ _id: articleId }).select('+owner').then((article) => {
    if (!article) {
      throw new Error404('Нет карточки с таким id');
    } else {
      const ownerId = article.owner._id;
      const ownerIdString = ownerId.toString();
      if (ownerIdString !== id) {
        throw new Error403();
      }
      Article.findByIdAndRemove({ _id: articleId })
        .then((item) => {
          res.send(item);
        });
    }
  })
    .catch((err) => {
      if (err.statusCode === 403) {
        const error403 = new Error403('Нельзя удалять чужую карточку');
        next(error403);
      } else if (err.kind === undefined) {
        const error404 = new Error404('Нет карточки с таким id');
        next(error404);
      } else if (err.kind === 'ObjectId') {
        const error400 = new Error400('Неправильный id');
        next(error400);
      } else {
        next(err);
      }
    });
};
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const { id } = req.user;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: id,
  })
    .then((data) => res.send({
      _id: data._id,
      keyword: data.keyword,
      title: data.title,
      text: data.text,
      date: data.date,
      source: data.source,
      link: data.link,
      image: data.image,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorList = Object.keys(err.errors);
        const messages = errorList.map((item) => err.errors[item].message);
        const error400 = new Error400(`Ошибка валидации: ${messages.join(' ')}`);
        next(error400);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getArticles,
  deleteArticleById,
  createArticle,
};
