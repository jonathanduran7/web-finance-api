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
});
