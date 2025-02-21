import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { AccountService } from 'src/account/account.service';
import { CategoryService } from 'src/category/category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from 'src/account/account.entity';
import { Category } from 'src/category/category.entity';

describe('TransactionService', () => {
  let service: TransactionService;

  const accountMock: Account = {
    id: 1,
    name: 'Account 1',
    initialBalance: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: null,
  };

  const categoryMock: Category = {
    id: 1,
    name: 'Category 1',
  };

  const transactionMock: Transaction = {
    id: 1,
    title: 'Transaction 1',
    description: 'Transaction 1 description',
    amount: 100,
    account: accountMock,
    category: categoryMock,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const serviceAccountMock = {
    findById: jest.fn(),
  };

  const serviceCategoryMock = {
    findById: jest.fn(),
  };

  const serviceMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: serviceMock,
        },
        {
          provide: AccountService,
          useValue: serviceAccountMock,
        },
        {
          provide: CategoryService,
          useValue: serviceCategoryMock,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty transactions', async () => {
    serviceMock.find.mockReturnValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should return transactions', async () => {
    serviceMock.find.mockReturnValue([transactionMock]);
    const result = await service.findAll();
    expect(result).toEqual([transactionMock]);
  });

  it('should return transaction', async () => {
    serviceMock.findOne.mockReturnValue(transactionMock);
    const result = await service.findById(1);
    expect(result).toEqual(transactionMock);
  });

  it('should show error when transaction not found', async () => {
    serviceMock.findOne.mockReturnValue(null);
    try {
      await service.findById(1);
    } catch (error) {
      expect(error.message).toEqual('Transaction not found');
    }
  });

  it('should create transaction', async () => {
    serviceAccountMock.findById.mockReturnValue(transactionMock.account);
    serviceCategoryMock.findById.mockReturnValue(transactionMock.category);
    serviceMock.save.mockReturnValue(transactionMock);
    await service.create(transactionMock);
    expect(serviceMock.save).toBeCalledWith(transactionMock);
  });

  it('should show error when account not found', async () => {
    serviceAccountMock.findById.mockReturnValue(null);
    try {
      await service.create(transactionMock);
    } catch (error) {
      expect(error.message).toEqual('Account not found');
    }
  });

  it('should show error when category not found', async () => {
    serviceAccountMock.findById.mockReturnValue(transactionMock.account);
    serviceCategoryMock.findById.mockReturnValue(null);
    try {
      await service.create(transactionMock);
    } catch (error) {
      expect(error.message).toEqual('Category not found');
    }
  });

  it('should update transaction', async () => {
    serviceMock.findOne.mockReturnValue(transactionMock);
    serviceAccountMock.findById.mockReturnValue(transactionMock.account);
    serviceCategoryMock.findById.mockReturnValue(transactionMock.category);
    serviceMock.update.mockReturnValue(transactionMock);
    await service.update(1, transactionMock);
    expect(serviceMock.update).toBeCalledWith(1, transactionMock);
  });

  it('should show error when transaction not found', async () => {
    serviceMock.findOne.mockReturnValue(null);
    try {
      await service.update(1, transactionMock);
    } catch (error) {
      expect(error.message).toEqual('Transaction not found');
    }
  });

  it('should show error when account not found', async () => {
    serviceMock.findOne.mockReturnValue(transactionMock);
    serviceAccountMock.findById.mockReturnValue(null);
    try {
      await service.update(1, transactionMock);
    } catch (error) {
      expect(error.message).toEqual('Account not found');
    }
  });

  it('should show error when category not found', async () => {
    serviceMock.findOne.mockReturnValue(transactionMock);
    serviceAccountMock.findById.mockReturnValue(transactionMock.account);
    serviceCategoryMock.findById.mockReturnValue(null);
    try {
      await service.update(1, transactionMock);
    } catch (error) {
      expect(error.message).toEqual('Category not found');
    }
  });

  it('should delete transaction', async () => {
    serviceMock.delete.mockReturnValue({ affected: 1 });
    await service.delete(1);
    expect(serviceMock.delete).toBeCalledWith({ id: 1 });
  });

  it('should show error when transaction not found', async () => {
    serviceMock.delete.mockReturnValue({ affected: 0 });
    try {
      await service.delete(1);
    } catch (error) {
      expect(error.message).toEqual('Data not found');
    }
  });
});
