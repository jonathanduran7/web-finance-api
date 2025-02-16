import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CurrencyService;

  const serviceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return empty currencies ', async () => {
    serviceMock.findAll.mockReturnValue([]);
    const result = await controller.getBase();
    expect(result).toEqual([]);
  });

  it('should return currencies ', async () => {
    serviceMock.findAll.mockReturnValue([{ id: 1, name: 'USD' }]);
    const result = await controller.getBase();
    expect(result).toEqual([{ id: 1, name: 'USD' }]);
  });

  it('should return currency ', async () => {
    serviceMock.findById.mockReturnValue({ id: 1, name: 'USD' });
    const result = await controller.getBaseById('1');
    expect(result).toEqual({ id: 1, name: 'USD' });
  });

  it('should create currency ', async () => {
    const data = { id: 1, name: 'USD' };
    serviceMock.create.mockReturnValue(data);
    const result = await controller.postBase(data);
    expect(result).toEqual(data);
  });

  it('should update currency ', async () => {
    const data = { id: 1, name: 'USD' };
    serviceMock.update.mockReturnValue(data);
    const result = await controller.putBase('1', data);
    expect(result).toEqual(data);
  });

  it('should delete currency ', async () => {
    serviceMock.delete.mockReturnValue(undefined);
    const result = await controller.deleteBase(1);
    expect(result).toBeUndefined();
  });

  it('should show error when currency not found ', async () => {
    serviceMock.findById.mockReturnValue(null);
    try {
      await controller.getBaseById('1');
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });
});
