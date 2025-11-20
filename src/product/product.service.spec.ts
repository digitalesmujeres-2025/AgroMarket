import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repository';
import { CategoryRepository } from 'src/category/repository';
import { BusinessRepository } from 'src/business/repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  const productRepo = {
    findProductByUuid: jest.fn(),
    findProductByCode: jest.fn(),
    findProductByName: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    findProductsByCategory: jest.fn(),
    deleteProduct: jest.fn(),
  } as unknown as ProductRepository;
  const categoryRepo = {
    findCategoryByUuid: jest.fn(),
  } as unknown as CategoryRepository;
  const businessRepo = {
    findBusinessByUuid: jest.fn(),
  } as unknown as BusinessRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: productRepo },
        { provide: CategoryRepository, useValue: categoryRepo },
        { provide: BusinessRepository, useValue: businessRepo },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('getProductById lanza NotFound si no existe', async () => {
    (productRepo.findProductByUuid as any).mockResolvedValue(null);
    await expect(service.getProductById('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('postCreateProduct lanza Conflict si code ya existe', async () => {
    (productRepo.findProductByCode as any).mockResolvedValue({ uuid: '1' });
    await expect(
      service.postCreateProduct({
        productCode: 1,
        name: 'p',
        categoryUuid: 'c',
        businessUuid: 'b',
        basePrice: 1,
      } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('postCreateProduct crea cuando todo válido', async () => {
    (productRepo.findProductByCode as any).mockResolvedValue(null);
    (productRepo.findProductByName as any).mockResolvedValue(null);
    (categoryRepo.findCategoryByUuid as any).mockResolvedValue({
      uuid: 'c',
      isActive: true,
    });
    (businessRepo.findBusinessByUuid as any).mockResolvedValue({
      uuid: 'b',
      estado: true,
    });
    (productRepo.createProduct as any).mockResolvedValue({ message: 'ok' });
    const res = await service.postCreateProduct({
      productCode: 1,
      name: 'p',
      categoryUuid: 'c',
      businessUuid: 'b',
      basePrice: 1,
    } as any);
    expect(res.message).toBe('ok');
  });
});
