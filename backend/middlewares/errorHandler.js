// Error Handling Middleware
/**
 * @desc    Global error handler for unhandled errors
 * @param   {Error} err - Error object
 * @param   {Request} req - Express request object
 * @param   {Response} res - Express response object
 * @param   {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
