import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  try {
    // Create the admins table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "admins" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
      );
    `);

    // Create unique indexes
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "admins_username_key" ON "admins"("username");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_key" ON "admins"("email");
    `);

    console.log('✅ Admin table created successfully!');
  } catch (error) {
    console.error('❌ Error creating admin table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
