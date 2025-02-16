import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { CurrencyService } from 'src/currency/currency.service';

describe('AccountService', () => {
  let service: AccountService;

  const serviceMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const serviceCurrencyMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: serviceMock,
        },
        {
          provide: CurrencyService,
          useValue: serviceCurrencyMock,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shour return empty accounts', async () => {
    serviceMock.find.mockReturnValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should return accounts', async () => {
    serviceMock.find.mockReturnValue([{ id: 1, name: 'Account 1' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, name: 'Account 1' }]);
  });

  it('should return account', async () => {
    serviceMock.findOne.mockReturnValue({ id: 1, name: 'Account 1' });
    const result = await service.findById(1);
    expect(result).toEqual({ id: 1, name: 'Account 1' });
  });

  it('should show error when account not found', async () => {
    serviceMock.findOne.mockReturnValue(null);
    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });

  it('should create account', async () => {
    const data = { id: 1, name: 'Account 1', currencyId: 1 };
    serviceMock.save.mockReturnValue(data);
    serviceCurrencyMock.findById.mockReturnValue({ id: 1, name: 'USD' });
    await service.create(data);
    expect(serviceMock.save).toHaveBeenCalledWith(data);
  });

  it('should show error when currency not found', async () => {
    const data = { id: 1, name: 'Account 1', currencyId: 1 };
    serviceCurrencyMock.findById.mockReturnValue(null);
    try {
      await service.create(data);
    } catch (e) {
      expect(e.message).toBe('Currency not found');
    }
  });

  it('should show error when account already exists', async () => {
    const data = { id: 1, name: 'Account 1', currencyId: 1 };
    serviceMock.findOne.mockReturnValue(data);
    serviceCurrencyMock.findById.mockReturnValue({ id: 1, name: 'USD' });
    try {
      await service.create(data);
    } catch (e) {
      expect(e.message).toBe('Account already exists');
    }
  });
});
