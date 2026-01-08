const router = require("express").Router();
const { asyncWrap } = require("../utils/asyncWrap");
const { auth } = require("../middleware/auth");
const c = require("../controllers/auth.controller");

router.post("/register", asyncWrap(c.register)); // optional (use for seeding)
router.get("/captcha", asyncWrap(c.captcha));
router.post("/login", asyncWrap(c.login));
router.post("/logout", asyncWrap(c.logout));
router.get("/me", auth, asyncWrap(c.me));

module.exports = router;
