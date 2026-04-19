const router = require("express").Router();
const c = require("../controllers/certificate.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
router.use(requireAuth);
router.get("/", c.list);
router.post("/", requireRole("ADMIN", "MANAGER"), c.create);
router.post("/:id/verify", c.verify);
module.exports = router;
