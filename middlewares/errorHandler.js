const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({ message: err.message });
  next();
};
module.exports = errorHandler;
