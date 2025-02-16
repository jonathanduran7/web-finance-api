import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';

describe('CategoryService', () => {
  let service: CategoryService;

  const mockCategory = { id: 1, name: 'Category 1' };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty categories', async () => {
    mockRepository.find.mockReturnValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should return categories', async () => {
    mockRepository.find.mockReturnValue([mockCategory]);
    const result = await service.findAll();
    expect(result).toEqual([mockCategory]);
  });

  it('should return category', async () => {
    mockRepository.findOne.mockReturnValue(mockCategory);
    const result = await service.findById(1);
    expect(result).toEqual(mockCategory);
  });

  it('should show error when category not found', async () => {
    mockRepository.findOne.mockReturnValue(null);
    try {
      await service.findById(1);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });

  it('should create category', async () => {
    await service.create(mockCategory);
    expect(mockRepository.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should update category', async () => {
    mockRepository.update.mockReturnValue({ affected: 1 });
    await service.update(1, mockCategory);
    expect(mockRepository.update).toHaveBeenCalledWith(1, mockCategory);
  });

  it('should show error when category not found', async () => {
    mockRepository.update.mockReturnValue({ affected: 0 });
    try {
      await service.update(1, mockCategory);
    } catch (e) {
      expect(e.message).toBe('Data not found');
    }
  });
});
