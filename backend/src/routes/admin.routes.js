const router = require("express").Router();
const { asyncWrap } = require("../utils/asyncWrap");
const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const c = require("../controllers/admin.controller");

router.use(auth);
router.use(requireRole("ADMIN"));

router.get("/level-users", asyncWrap(c.adminNextLevelUsers));
router.get("/downline/:userId", asyncWrap(c.adminDownline));
router.post("/credit", asyncWrap(c.adminCredit));
router.get("/summary", asyncWrap(c.adminBalanceSummary));
router.get("/downline/:userId", asyncWrap(c.getDownlineTree));

module.exports = router;
