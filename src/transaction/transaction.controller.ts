import { Controller, Get, Post } from '@nestjs/common';
import {
  fromPrismaTransactionToTransactionDto,
  fromTransactionDtoToPrismaTransaction,
} from '../mapper';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async createTransaction(data: TransactionDto): Promise<TransactionDto> {
    return fromPrismaTransactionToTransactionDto(
      await this.transactionService.createTransaction(data),
    );
  }

  @Post()
  async updateTransaction(
    id: string,
    data: TransactionDto,
  ): Promise<TransactionDto> {
    return fromPrismaTransactionToTransactionDto(
      await this.transactionService.updateTransaction(
        id,
        fromTransactionDtoToPrismaTransaction(data),
      ),
    );
  }

  @Get(':id')
  async getTransactionById(id: string): Promise<TransactionDto> {
    return fromPrismaTransactionToTransactionDto(
      await this.transactionService.getTransactionById(id),
    );
  }

  @Get(':userId')
  async getUserTransactions(userId: string): Promise<TransactionDto[]> {
    return (await this.transactionService.getUserTransactions(userId)).map(
      fromPrismaTransactionToTransactionDto,
    );
  }

  @Get()
  async getAllTransactions(): Promise<TransactionDto[]> {
    return (await this.transactionService.getAllTransactions()).map(
      fromPrismaTransactionToTransactionDto,
    );
  }
}
