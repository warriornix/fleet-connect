const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const where = req.user.role === "DRIVER" ? { userId: req.user.sub } : {};
  res.json(await prisma.vehicle.findMany({ where, orderBy: { createdAt: "desc" } }));
};
exports.create = async (req, res) => res.status(201).json(await prisma.vehicle.create({ data: req.body }));
exports.update = async (req, res) => res.json(await prisma.vehicle.update({ where: { id: req.params.id }, data: req.body }));
exports.remove = async (req, res) => { await prisma.vehicle.delete({ where: { id: req.params.id } }); res.status(204).end(); };
