const Article = require('../models/article');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getArticles = (req, res) => {
  const { id } = req.user;
  Article.find({ owner: id })
  .then((articles) => res.send(articles))
  .catch((err) => res.status(500).send({ message: `Ошибка на сервере: ${err.message}` }));
};

module.exports.createArticle = (req, res, next) => {
  console.log(req.body);
  console.log(req.user)
  // console.log(req.user._id);
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
    .catch((err) => {
      throw new BadRequestError({ message: `Некорректные данные: ${err.message}` });
    })
    .then((article) => res.send({
      _id: article._id,
      keyword: article.keyword,
      title: article.title,
      text: article.text,
      date: article.date,
      source: article.source,
      link: article.link,
      image: article.image,
    }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const { id } = req.user;
  Article.findOne({_id: articleId}).select('+owner')
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Не найдено карточки с таким id' });
    })
    .then((article) => {
      const ownerId = article.owner._id;
      const ownerIdString = ownerId.toString();
      if (ownerIdString !== id) {
        throw new ForbiddenError({ message: 'У вас недостаточно прав' });
      }
      Article.findByIdAndRemove({ _id: articleId })
        .then((article) => {
          res.send(article);
        })
        .catch(next);
    })
    .catch(next);
};
