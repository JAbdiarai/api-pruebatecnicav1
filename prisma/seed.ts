import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { encryptToBuffer } from "../src/config/crypto";
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

async function createPaymentMethods(userId: string) {
  console.log('💳 Creating payment methods...');

  // Verificar si ya existen métodos de pago
  const existingMethods = await prisma.payment_Method.findMany({
    where: { user_id: userId },
  });

  if (existingMethods.length > 0) {
    console.log('✅ Payment methods already exist');
    return;
  }

  // Métodos de pago aleatorios
  const paymentMethods = [
    {
      brand: 'VISA',
      cardNumber: '4532015112830366',
      last4: '0366',
    },
    {
      brand: 'MASTERCARD',
      cardNumber: '5425233430109903',
      last4: '9903',
    },
    {
      brand: 'AMEX',
      cardNumber: '374245455400126',
      last4: '0126',
    },
  ];

  for (const method of paymentMethods) {
    const { ciphertext, iv } = encryptToBuffer(method.cardNumber);
    
    await prisma.payment_Method.create({
      data: {
        user_id: userId,
        brand: method.brand,
        last4: method.last4,
        token_encrypted: ciphertext,
        iv,
      },
    });

    console.log(`   ✅ ${method.brand} **** ${method.last4} created`);
  }

  console.log('✅ Payment methods created successfully');
}

async function main() {
  const admin = await createUser();
  
  if (admin) {
    await createPaymentMethods(admin.id);
  } else {
    // Si el admin ya existía, obtener su ID
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });
    
    if (existingAdmin) {
      await createPaymentMethods(existingAdmin.id);
    }
  }
}

main()
  .then(async () => {
    console.log('🎉 Seeding completed!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
  });
