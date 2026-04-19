const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const sign = (u) => ({
  access: jwt.sign({ sub: u.id, role: u.role, email: u.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }),
  refresh: jwt.sign({ sub: u.id, type: "refresh" }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }),
});

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email taken" });
  const user = await prisma.user.create({ data: { email, password: bcrypt.hashSync(password, 10), name } });
  res.status(201).json({ user: { id: user.id, email, name, role: user.role }, ...sign(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Bad credentials" });
  res.json({ user: { id: user.id, email, name: user.name, role: user.role }, ...sign(user) });
};

exports.me = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.sub }, select: { id: true, email: true, name: true, role: true } });
  res.json({ user });
};
