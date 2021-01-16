const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res) => Card.find({})
  .populate('user')
  .then((cards) => res.send(cards))
  .catch((err) => res.status(500).send({ message: `Ошибка на сервере: ${err.message}` }));

module.exports.createCard = (req, res, next) => {
  console.log(req.body);
  console.log(req.user._id);
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .catch((err) => {
      throw new BadRequestError({ message: `Некорректные данные: ${err.message}` });
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Не найдено карточки с таким id' });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'У вас недостаточно прав' });
      }
      Card.findByIdAndDelete(req.params._id)
        .then((card) => {
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => 
Card.findByIdAndUpdate( req.params._id, { $addToSet: { likes: req.user._id },},{ new: true }, )  
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

module.exports.removeLike = (req, res, next) => Card.findByIdAndUpdate(
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
