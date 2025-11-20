import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  const repo = {
    findActiveCategories: jest.fn(),
    findCategoryByName: jest.fn(),
    createCategory: jest.fn(),
    findCategoryByUuid: jest.fn(),
    updateCategory: jest.fn(),
    activateCategory: jest.fn(),
    softDeleteCategory: jest.fn(),
  } as unknown as CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    jest.clearAllMocks();
  });

  it('getActiveCategories devuelve categorías activas', async () => {
    (repo.findActiveCategories as any).mockResolvedValue([
      { uuid: '1', name: 'Frutas', isActive: true },
    ]);
    const res = await service.getActiveCategories();
    expect(res).toHaveLength(1);
    expect(res[0].name).toBe('Frutas');
  });

  it('getActiveCategories lanza NotFound si no hay activas', async () => {
    (repo.findActiveCategories as any).mockResolvedValue([]);
    await expect(service.getActiveCategories()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('postCreateCategory lanza Conflict si el nombre existe', async () => {
    (repo.findCategoryByName as any).mockResolvedValue({ uuid: '1' });
    await expect(
      service.postCreateCategory({ name: 'Frutas', description: '' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('postCreateCategory crea cuando no existe', async () => {
    (repo.findCategoryByName as any).mockResolvedValue(null);
    (repo.createCategory as any).mockResolvedValue({ uuid: '2', name: 'Café' });
    const res = await service.postCreateCategory({
      name: 'Café',
      description: '',
    });
    expect(res.uuid).toBe('2');
    expect(res.name).toBe('Café');
  });

  it('putUpdateCategory lanza NotFound si uuid no existe', async () => {
    (repo.findCategoryByUuid as any).mockResolvedValue(null);
    await expect(
      service.putUpdateCategory({ uuid: 'x', name: 'Nueva', description: '' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
