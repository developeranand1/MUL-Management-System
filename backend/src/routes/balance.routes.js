const router = require("express").Router();
const { asyncWrap } = require("../utils/asyncWrap");
const { auth } = require("../middleware/auth");
const c = require("../controllers/balance.controller");

router.use(auth);

router.post("/self-recharge", asyncWrap(c.ownerSelfRecharge));
router.post("/transfer", asyncWrap(c.transferToChild));
router.get("/statement", asyncWrap(c.myStatement));

module.exports = router;
