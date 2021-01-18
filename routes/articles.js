const router = require('express').Router();
const {
  getArticle,
  createArticle,
  deleteArticle,
  addLike,
  removeLike,
} = require('../controllers/articles');

const {
  validateUserId,
  validateArticle,
} = require('../middlewares/validators');

// Получение карточек
router.get('/', getArticle);

// // Создание карточки
router.post('/', validateArticle, createArticle);

// Удаление карточки
router.delete('/:articleId', validateUserId, deleteArticle);

// Добавление лайка
router.put('/:articleId/likes', validateUserId, addLike);
// Удаление лайка
router.delete('/:articleId/likes', validateUserId, removeLike);
module.exports = router;
