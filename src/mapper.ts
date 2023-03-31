import { Prisma, Transaction, User } from '@prisma/client';
import { TransactionDto } from './transaction/transaction.dto';
import { UserDto } from './users/users.dto';

export function fromTransactionDtoToPrismaTransaction(
  data: TransactionDto,
): Transaction {
  return {
    id: data.id,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    escrowAgentId: data.escrowAgentId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export function fromPrismaTransactionToTransactionDto(
  source: Transaction,
): TransactionDto {
  return {
    id: source.id,
    buyerId: source.buyerId,
    sellerId: source.sellerId,
    escrowAgentId: source.escrowAgentId,
    amount: source.amount,
    currency: source.currency,
    status: source.status,
    createdAt: source.createdAt.toISOString(),
    updatedAt: source.updatedAt.toISOString(),
  };
}

export function fromPrismaUserToUserDto(
  data: User,
): Omit<Omit<UserDto, 'password'>, 'rtHash'> {
  return {
    id: data.id,
    email: data.email,
  };
}

export function fromUserDtoToPrismaUser(source: UserDto): User {
  return {
    id: source.id,
    email: source.email,
    password: source.password,
    rtHash: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
