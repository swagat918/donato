const ApiError = require('../utils/ApiError');

function validateRequest(schema) {
  return function validationMiddleware(req, res, next) {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      return next(new ApiError(400, issue?.message || 'Invalid request body'));
    }

    req.body = result.data;
    return next();
  };
}

module.exports = validateRequest;
