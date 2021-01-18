const Article = require('../models/article');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getArticles = (req, res) => Article.find({})
  .populate('user')
  .then((articles) => res.send(articles))
  .catch((err) => res.status(500).send({ message: `Ошибка на сервере: ${err.message}` }));

module.exports.createArticle = (req, res, next) => {
  console.log(req.body);
  console.log(req.user._id);
  Article.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .catch((err) => {
      throw new BadRequestError({ message: `Некорректные данные: ${err.message}` });
    })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Не найдено карточки с таким id' });
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'У вас недостаточно прав' });
      }
      Article.findByIdAndDelete(req.params._id)
        .then((article) => {
          res.send(article);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) =>
Article.findByIdAndUpdate( req.params._id, { $addToSet: { likes: req.user._id },},{ new: true }, )
    .orFail(() => {
      const err = new Error('Карточка не найдена');
      err.statusCode = 404;
      throw err;
    })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Не найдено карточки с таким id' });
    })
    .then((likes) => res.send(likes))
    .catch(next);

module.exports.removeLike = (req, res, next) => Article.findByIdAndUpdate(
  req.params._id,
  {
    $pull: { likes: req.user._id },
  },
  { new: true },
)
  .orFail(() => {
    const err = new Error('Карточка не найдена');
    err.statusCode = 404;
    throw err;
  })
  .orFail()
  .catch(() => {
    throw new NotFoundError({ message: 'Не найдено карточки с таким id' });
  })
  .then((likes) => res.send(likes))
  .catch(next);
