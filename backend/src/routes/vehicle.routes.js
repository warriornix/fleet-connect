const router = require("express").Router();
const c = require("../controllers/vehicle.controller");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
router.use(requireAuth);
router.get("/", c.list);
router.post("/", requireRole("ADMIN", "MANAGER"), c.create);
router.put("/:id", requireRole("ADMIN", "MANAGER"), c.update);
router.delete("/:id", requireRole("ADMIN", "MANAGER"), c.remove);
module.exports = router;
