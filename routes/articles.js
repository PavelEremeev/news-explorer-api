const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createArticleRequest, deleteArticleRequest } = require('../middlewares/request-validation');

const {
  getArticles,
  deleteArticleById,
  createArticle,
} = require('../controllers/article');

router.get('/articles', getArticles);
router.post('/articles', celebrate(createArticleRequest), createArticle);
router.delete('/articles/:articleId', celebrate(deleteArticleRequest), deleteArticleById);

module.exports = router;
