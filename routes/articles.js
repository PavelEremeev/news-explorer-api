const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateUserId,
  validateArticle,
} = require('../middlewares/validators');

// Получение карточек
router.get('/', getArticles);

// // Создание карточки
router.post('/', validateArticle, createArticle);

// Удаление карточки
router.delete('/:articleId', validateUserId, deleteArticle);


module.exports = router;
