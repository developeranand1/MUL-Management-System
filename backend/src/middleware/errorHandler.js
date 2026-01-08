const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors
    });
  }
  console.error("❌", err);
  res.status(500).json({ message: "Server error" });
}

module.exports = { errorHandler };
