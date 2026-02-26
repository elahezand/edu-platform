const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return next({
      status: 422,
      message: "Invalid data",
      errors: parsed.error.issues
    });
  }

  req.parsed = parsed; 
  next();
};

module.exports = validate;