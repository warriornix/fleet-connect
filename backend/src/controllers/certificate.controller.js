const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.list = async (req, res) => res.json(await prisma.certificate.findMany({ orderBy: { issueDate: "desc" } }));

exports.create = async (req, res) => {
  const { vehicleId, type, expiryDate, documentUrl } = req.body;
  const issueDate = new Date();
  const payload = JSON.stringify({ vehicleId, type, issueDate });
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  const blockchainTx = "0x" + hash.slice(0, 56);
  const cert = await prisma.certificate.create({
    data: { vehicleId, userId: req.user.sub, type, hash, blockchainTx, verified: true, issueDate, expiryDate: expiryDate || null, documentUrl: documentUrl || null },
  });
  res.status(201).json(cert);
};

exports.verify = async (req, res) => {
  const cert = await prisma.certificate.findUnique({ where: { id: req.params.id } });
  if (!cert) return res.status(404).json({ error: "Not found" });
  const payload = JSON.stringify({ vehicleId: cert.vehicleId, type: cert.type, issueDate: cert.issueDate });
  const recomputed = crypto.createHash("sha256").update(payload).digest("hex");
  const ok = recomputed === cert.hash;
  if (ok && !cert.verified) await prisma.certificate.update({ where: { id: cert.id }, data: { verified: true } });
  res.json({ valid: ok, hash: cert.hash, recomputed });
};
