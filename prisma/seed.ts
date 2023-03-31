import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete all records

  // prisma.user.deleteMany({});
  // prisma.transaction.deleteMany({});
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
  const transactionsData = [
    {
      buyerId: createdUsers[0].id,
      sellerId: createdUsers[1].id,
      escrowAgentId: createdUsers[2].id,
      amount: 1500,
      currency: 'USD',
      status: 'completed',
    },
    {
      buyerId: createdUsers[3].id,
      sellerId: createdUsers[4].id,
      escrowAgentId: createdUsers[2].id,
      amount: 3500,
      currency: 'USD',
      status: 'in_progress',
    },
    {
      buyerId: createdUsers[4].id,
      sellerId: createdUsers[1].id,
      escrowAgentId: createdUsers[2].id,
      amount: 750,
      currency: 'USD',
      status: 'completed',
    },
    {
      buyerId: createdUsers[0].id,
      sellerId: createdUsers[3].id,
      escrowAgentId: createdUsers[2].id,
      amount: 1200,
      currency: 'USD',
      status: 'in_progress',
    },
    {
      buyerId: createdUsers[1].id,
      sellerId: createdUsers[0].id,
      escrowAgentId: createdUsers[2].id,
      amount: 900,
      currency: 'USD',
      status: 'completed',
    },
    {
      buyerId: createdUsers[4].id,
      sellerId: createdUsers[2].id,
      escrowAgentId: createdUsers[3].id,
      amount: 1100,
      currency: 'USD',
      status: 'pending',
    },
    {
      buyerId: createdUsers[2].id,
      sellerId: createdUsers[3].id,
      escrowAgentId: createdUsers[1].id,
      amount: 2500,
      currency: 'USD',
      status: 'completed',
    },
    {
      buyerId: createdUsers[3].id,
      sellerId: createdUsers[1].id,
      escrowAgentId: createdUsers[4].id,
      amount: 1800,
      currency: 'USD',
      status: 'completed',
    },
    {
      buyerId: createdUsers[1].id,
      sellerId: createdUsers[4].id,
      escrowAgentId: createdUsers[0].id,
      amount: 4500,
      currency: 'USD',
      status: 'in_progress',
    },
    {
      buyerId: createdUsers[2].id,
      sellerId: createdUsers[0].id,
      escrowAgentId: createdUsers[1].id,
      amount: 550,
      currency: 'USD',
      status: 'pending',
    },
  ];

  const createdTransactions = await Promise.all(
    transactionsData.map((transaction) =>
      prisma.transaction.create({ data: transaction }),
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
