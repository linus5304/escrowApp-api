import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  buyerId: string;

  @IsString()
  sellerId: string;

  @IsString()
  escrowAgentId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  status: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
