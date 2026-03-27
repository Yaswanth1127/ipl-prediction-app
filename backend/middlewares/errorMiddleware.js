const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    message: err.message || "Something went wrong.",
  });
};

module.exports = errorMiddleware;
