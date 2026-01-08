const router = require("express").Router();
const { asyncWrap } = require("../utils/asyncWrap");
const { auth } = require("../middleware/auth");
const c = require("../controllers/users.controller");

router.use(auth);

router.post("/", asyncWrap(c.createNextLevelUser));
router.get("/children", asyncWrap(c.myChildren));
router.get("/downline", asyncWrap(c.myDownline));
router.patch("/:id/password", asyncWrap(c.changeChildPassword));

router.post("/:childId/change-password", asyncWrap(c.changeDirectChildPassword));

module.exports = router;
