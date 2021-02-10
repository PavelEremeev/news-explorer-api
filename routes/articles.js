const router = require('express').Router();
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateArticleId,
  validateArticle,
} = require('../middlewares/validators');

// Получение карточек
router.get('/', getArticles);

// // Создание карточки
router.post('/', validateArticle, createArticle);

// Удаление карточки
router.delete('/:articleId', validateArticleId, deleteArticle);


module.exports = router;
