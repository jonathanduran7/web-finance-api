import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Currency } from './currency.entity';

describe('CurrencyService', () => {
  let service: CurrencyService;

  const currencyRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: getRepositoryToken(Currency),
          useValue: currencyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty currencies ', async () => {
    currencyRepositoryMock.find.mockReturnValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });
});
