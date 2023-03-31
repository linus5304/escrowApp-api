import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = [
    {
      email: 'buyer1@example.com',
      password: await bcrypt.hash('password1', 10),
    },
    {
      email: 'buyer2@example.com',
      password: await bcrypt.hash('password2', 10),
    },
    {
      email: 'seller1@example.com',
      password: await bcrypt.hash('password3', 10),
    },
    {
      email: 'seller2@example.com',
      password: await bcrypt.hash('password4', 10),
    },
    {
      email: 'agent1@example.com',
      password: await bcrypt.hash('password5', 10),
    },
    // Add more users here
  ];

  const createdUsers = await Promise.all(
    users.map(async (userData) => {
      return prisma.user.create({ data: userData });
    }),
  );

  // Seed Transactions
  const transactions = [
    {
      buyerId: createdUsers[0].id,
      sellerId: createdUsers[2].id,
      escrowAgentId: createdUsers[4].id,
      amount: 1000,
      currency: 'USD',
      status: 'PENDING',
    },
    {
      buyerId: createdUsers[1].id,
      sellerId: createdUsers[3].id,
      escrowAgentId: createdUsers[4].id,
      amount: 500,
      currency: 'USD',
      status: 'COMPLETED',
    },
    // Add more transactions here
  ];

  for (const transactionData of transactions) {
    await prisma.transaction.create({ data: transactionData });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
