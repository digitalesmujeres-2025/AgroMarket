import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { BusinessRepository } from './repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('BusinessService', () => {
  let service: BusinessService;
  const repo = {
    getAllBusinessRepository: jest.fn(),
    getBusinessByIdRepository: jest.fn(),
    getBusinessProfileRepository: jest.fn(),
    getBusinessByNameRepository: jest.fn(),
    getBusinessByRegister: jest.fn(),
    getBusinessByName: jest.fn(),
    getBusinessByUserUuid: jest.fn(),
    createBusinessRepository: jest.fn(),
    putUpdateBusinessRepository: jest.fn(),
    deleteBusinessRepository: jest.fn(),
  } as unknown as BusinessRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        { provide: BusinessRepository, useValue: repo },
      ],
    }).compile();
    service = module.get<BusinessService>(BusinessService);
    jest.clearAllMocks();
  });

  it('getAllBusinessService retorna negocios', async () => {
    (repo.getAllBusinessRepository as any).mockResolvedValue([{ uuid: '1' }]);
    const res = await service.getAllBusinessService();
    expect(res).toHaveLength(1);
  });

  it('getBusinessByIdService lanza NotFound si no existe', async () => {
    (repo.getBusinessByIdRepository as any).mockResolvedValue(null);
    await expect(service.getBusinessByIdService('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('postCreateBusinessService valida requeridos y lanza BadRequest', async () => {
    await expect(
      service.postCreateBusinessService({} as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deleteBusinessService lanza Conflict si ya inactivo', async () => {
    (repo.getBusinessByIdRepository as any).mockResolvedValue({
      estado: false,
    });
    await expect(service.deleteBusinessService('x')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
