// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Default password ko hash karenge
  const hashedPassword = await bcrypt.hash('password', 10);

  // Tenants (Companies) banayenge
  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme',
      slug: 'acme',
    },
  });

  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex',
      slug: 'globex',
    },
  });

  // Acme ke liye Users banayenge
  await prisma.user.create({
    data: {
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: acme.id,
    },
  });
  await prisma.user.create({
    data: {
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: acme.id,
    },
  });

  // Globex ke liye Users banayenge
  await prisma.user.create({
    data: {
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: globex.id,
    },
  });
  await prisma.user.create({
    data: {
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'MEMBER',
      tenantId: globex.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });