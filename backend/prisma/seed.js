const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hash = (p) => bcrypt.hashSync(p, 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vlip.com" },
    create: { email: "admin@vlip.com", password: hash("admin123"), name: "Admin User", role: "ADMIN" },
    update: {},
  });
  const manager = await prisma.user.upsert({
    where: { email: "manager@vlip.com" },
    create: { email: "manager@vlip.com", password: hash("manager123"), name: "Manager User", role: "MANAGER" },
    update: {},
  });
  const driver = await prisma.user.upsert({
    where: { email: "driver@vlip.com" },
    create: { email: "driver@vlip.com", password: hash("driver123"), name: "Driver User", role: "DRIVER" },
    update: {},
  });

  const seed = [
    { make: "Toyota", model: "Camry", year: 2022, vin: "4T1B11HK3NU100001", licensePlate: "VLP-001", color: "Silver", mileage: 24500 },
    { make: "Honda", model: "CR-V", year: 2021, vin: "5J6RW2H50ML000002", licensePlate: "VLP-002", color: "Blue", mileage: 38200 },
    { make: "Ford", model: "F-150", year: 2023, vin: "1FTFW1E50PFA00003", licensePlate: "VLP-003", color: "Black", mileage: 12100 },
    { make: "Tesla", model: "Model 3", year: 2023, vin: "5YJ3E1EA0PF000004", licensePlate: "VLP-004", color: "White", mileage: 8900 },
    { make: "Chevrolet", model: "Silverado", year: 2022, vin: "1GCUYDED3NZ00005", licensePlate: "VLP-005", color: "Red", mileage: 31000, status: "MAINTENANCE" },
  ];
  for (const v of seed) {
    await prisma.vehicle.upsert({ where: { vin: v.vin }, create: { ...v, userId: driver.id }, update: {} });
  }
  console.log("Seeded:", { admin: admin.email, manager: manager.email, driver: driver.email });
}
main().catch(console.error).finally(() => prisma.$disconnect());
