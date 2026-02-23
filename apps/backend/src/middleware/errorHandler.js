export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    valid: false,
    error: err.message || "Internal server error",
  });
};
