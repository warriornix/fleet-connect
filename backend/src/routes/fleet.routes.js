const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const prisma = new PrismaClient();
router.use(requireAuth);

// Vehicle research (mocked spec lookup)
router.get("/research/search", (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  const db = {
    "toyota camry": { mpg: 32, hp: 203, trims: ["LE", "SE", "XLE"] },
    "tesla model 3": { mpg: 132, hp: 283, trims: ["Standard", "Long Range", "Performance"] },
  };
  res.json(db[q] || null);
});

// Fuel
router.get("/fuel/logs", async (_req, res) => res.json(await prisma.fuelLog.findMany({ orderBy: { date: "desc" } })));
router.post("/fuel/logs", async (req, res) => {
  const log = await prisma.fuelLog.create({ data: { ...req.body, userId: req.user.sub } });
  res.status(201).json(log);
});

// Maintenance
router.get("/maintenance", async (_req, res) => res.json(await prisma.maintenance.findMany({ orderBy: { date: "desc" } })));
router.post("/maintenance", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const m = await prisma.maintenance.create({ data: { ...req.body, userId: req.user.sub } });
  res.status(201).json(m);
});

// Schedules
router.get("/schedules/upcoming", async (_req, res) => res.json(
  await prisma.schedule.findMany({ where: { scheduledDate: { gte: new Date() } }, orderBy: { scheduledDate: "asc" } })
));
router.post("/schedules", requireRole("ADMIN", "MANAGER"), async (req, res) =>
  res.status(201).json(await prisma.schedule.create({ data: req.body }))
);

// Recalls (mocked)
router.get("/recalls/search", (req, res) => {
  const vin = (req.query.vin || "").toString().toUpperCase();
  const db = { "1HGBH41JXMN109186": [{ id: "NHTSA-23V-450", title: "Airbag inflator", manufacturer: "Honda" }] };
  res.json(db[vin] || []);
});

// Analytics
router.get("/analytics", requireRole("ADMIN", "MANAGER"), async (_req, res) => {
  const [vehicles, fuel, maint] = await Promise.all([
    prisma.vehicle.count(),
    prisma.fuelLog.aggregate({ _sum: { gallons: true, cost: true } }),
    prisma.maintenance.aggregate({ _sum: { cost: true }, _count: true }),
  ]);
  res.json({ vehicles, fuel: fuel._sum, maintenance: { count: maint._count, cost: maint._sum.cost } });
});

// Reports
router.get("/reports/fleet", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const fmt = (req.query.format || "pdf").toString();
  const rows = await prisma.vehicle.findMany();
  if (fmt === "csv") {
    const header = "year,make,model,vin,license,mileage,status\n";
    const body = rows.map(r => [r.year, r.make, r.model, r.vin, r.licensePlate, r.mileage, r.status].join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=fleet.csv");
    return res.send(header + body);
  }
  if (fmt === "excel") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Fleet");
    ws.columns = [
      { header: "Year", key: "year" }, { header: "Make", key: "make" }, { header: "Model", key: "model" },
      { header: "VIN", key: "vin" }, { header: "Plate", key: "licensePlate" }, { header: "Mileage", key: "mileage" }, { header: "Status", key: "status" },
    ];
    rows.forEach(r => ws.addRow(r));
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=fleet.xlsx");
    return wb.xlsx.write(res).then(() => res.end());
  }
  // pdf
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=fleet.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("VLIP Fleet Report").moveDown();
  rows.forEach(r => doc.fontSize(10).text(`${r.year} ${r.make} ${r.model} · ${r.licensePlate} · ${r.mileage} mi · ${r.status}`));
  doc.end();
});

// Users (admin)
router.get("/users", requireRole("ADMIN"), async (_req, res) =>
  res.json(await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } }))
);

module.exports = router;
