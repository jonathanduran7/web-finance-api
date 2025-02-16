import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Currency } from './currency.entity';

describe('CurrencyService', () => {
  let service: CurrencyService;

  const currencyMock = { id: 1, name: 'USD' };

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

  it('should return currencies ', async () => {
    currencyRepositoryMock.find.mockReturnValue([currencyMock]);
    const result = await service.findAll();
    expect(result).toEqual([currencyMock]);
  });

  it('should return currency ', async () => {
    currencyRepositoryMock.findOne.mockReturnValue([currencyMock]);
    const result = await service.findById(1);
    expect(result).toEqual([currencyMock]);
  });

  it('should show error when currency not found ', async () => {
    currencyRepositoryMock.findOne.mockReturnValue(null);
    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });

  it('should create currency ', async () => {
    await service.create(currencyMock);
    expect(currencyRepositoryMock.save).toHaveBeenCalledWith(currencyMock);
  });

  it('should update currency ', async () => {
    currencyRepositoryMock.update.mockReturnValue({ affected: 1 });
    await service.update(1, currencyMock);
    expect(currencyRepositoryMock.update).toHaveBeenCalledWith(1, currencyMock);
  });

  it('should show error when currency not found for update ', async () => {
    currencyRepositoryMock.update.mockReturnValue({ affected: 0 });
    try {
      await service.update(1, currencyMock);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });

  it('should delete currency ', async () => {
    currencyRepositoryMock.delete.mockReturnValue({ affected: 1 });
    await service.delete(1);
    expect(currencyRepositoryMock.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should show error when currency not found for delete ', async () => {
    currencyRepositoryMock.delete.mockReturnValue({ affected: 0 });
    try {
      await service.delete(1);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });
});
