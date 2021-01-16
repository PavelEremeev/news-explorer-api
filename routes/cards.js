const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

const {
  validateUserId,
  validateCard,
} = require('../middlewares/validators');

// Получение карточек
router.get('/', getCards);

// // Создание карточки
router.post('/', validateCard, createCard);

// Удаление карточки
router.delete('/:_id', validateUserId, deleteCard);

// Добавление лайка
router.put('/:_id/likes', validateUserId, addLike);
// Удаление лайка
router.delete('/:_id/likes', validateUserId, removeLike);
module.exports = router;
