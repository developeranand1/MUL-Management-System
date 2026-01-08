require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const morgan = require('morgan');
const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(morgan('dev'));

app.post("/api/debug", (req, res) => {
  res.json({ body: req.body, contentType: req.headers["content-type"] });
});


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});

app.use("/api/auth/login", loginLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/balance", require("./routes/balance.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.use(errorHandler);

module.exports = app;
