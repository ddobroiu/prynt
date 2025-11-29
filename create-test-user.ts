import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return existingUser;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        passwordHash: hashedPassword,
        emailVerified: new Date()
      }
    });

    console.log('Test user created:', user.email);
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();