const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return;
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
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/mobile-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });

    const data = await response.json();
    console.log('Login test result:', data);
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

async function main() {
  await createTestUser();
  console.log('\nWaiting 2 seconds before testing login...\n');
  setTimeout(testLogin, 2000);
}

main();