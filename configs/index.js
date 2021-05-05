const SALT_ROUND = 10;
const JWT_SECRET_DEV = 'LUMPY_SPACE_PRINCESS';
const MONGO_BASE_DEV = 'mongodb://localhost:27017/newsdb';
const { JWT_SECRET } = process.env;
const { MONGO_BASE } = process.env;

module.exports = {
  SALT_ROUND,
  JWT_SECRET_DEV,
  MONGO_BASE_DEV,
  JWT_SECRET,
  MONGO_BASE,
};
