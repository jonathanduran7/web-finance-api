import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { AccountService } from 'src/account/account.service';
import { CategoryService } from 'src/category/category.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;

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
});
