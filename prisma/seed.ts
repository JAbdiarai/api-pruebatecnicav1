import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  console.log('🌱 Seeding database...');

  // Crear usuario administrador
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!'; // Cambiar en producción

  // Verificar si ya existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Hash de la contraseña
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      lastname: 'System',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);
  
  return admin;
}




createUser()
  .then(async () => {
    console.log('🎉 Seeding completed!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
  });
