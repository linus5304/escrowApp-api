import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async updateTransaction(
    id: string,
    data: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: true,
        seller: true,
        escrowAgent: true,
      },
    });
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
          { escrowAgentId: userId },
        ],
      },
      include: {
        buyer: true,
        seller: true,
        escrowAgent: true,
      },
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        buyer: true,
        seller: true,
        escrowAgent: true,
      },
    });
  }
}
