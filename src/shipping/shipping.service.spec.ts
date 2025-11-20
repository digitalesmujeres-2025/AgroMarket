import { Test, TestingModule } from '@nestjs/testing';
import { ShippingService } from './shipping.service';
import { ShippingRepository } from './repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EstadoEnvio } from 'src/entities/shipping.entity';

describe('ShippingService', () => {
  let service: ShippingService;
  const repo = {
    getAllShippingRepository: jest.fn(),
    getShippingByIdRepository: jest.fn(),
    getShippingByEstadoRepository: jest.fn(),
    getShippingByOrderUuid: jest.fn(),
    createShippingRepository: jest.fn(),
    putUpdateShippingRepository: jest.fn(),
    deleteShippingRepository: jest.fn(),
  } as unknown as ShippingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingService,
        { provide: ShippingRepository, useValue: repo },
      ],
    }).compile();
    service = module.get<ShippingService>(ShippingService);
    jest.clearAllMocks();
  });

  it('getShippingByIdService lanza NotFound si no existe', async () => {
    (repo.getShippingByIdRepository as any).mockResolvedValue(null);
    await expect(service.getShippingByIdService('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('postCreateShippingService requiere uuid_orden_de_compra', async () => {
    await expect(
      service.postCreateShippingService({} as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('putUpdateShippingService lanza NotFound si no existe', async () => {
    (repo.getShippingByIdRepository as any).mockResolvedValue(null);
    await expect(
      service.putUpdateShippingService('x', {} as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('putUpdateShippingService delega al repositorio', async () => {
    (repo.getShippingByIdRepository as any).mockResolvedValue({
      uuid: 's',
      estado_envio: EstadoEnvio.PENDIENTE,
    });
    (repo.putUpdateShippingRepository as any).mockResolvedValue({
      message: 'ok',
    });
    const res = await service.putUpdateShippingService('s', {
      estado_envio: EstadoEnvio.EN_CAMINO,
    } as any);
    expect(res.message).toBe('ok');
    expect(repo.putUpdateShippingRepository).toHaveBeenCalled();
  });

  it('getShippingByOrderUuidService lanza NotFound si no existe', async () => {
    (repo.getShippingByOrderUuid as any).mockResolvedValue(null);
    await expect(
      service.getShippingByOrderUuidService('o'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getShippingByOrderUuidService retorna envío', async () => {
    (repo.getShippingByOrderUuid as any).mockResolvedValue({ uuid: 's' });
    const res = await service.getShippingByOrderUuidService('o');
    expect(res.uuid).toBe('s');
  });

  it('postCreateShippingService lanza Conflict si ya existe para orden', async () => {
    (repo.getShippingByOrderUuid as any).mockResolvedValue({ uuid: 's' });
    await expect(
      service.postCreateShippingService({ uuid_orden_de_compra: 'o' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('getShippingByEstadoService lanza NotFound si no hay envíos', async () => {
    (repo.getShippingByEstadoRepository as any).mockResolvedValue([]);
    await expect(
      service.getShippingByEstadoService(EstadoEnvio.PENDIENTE),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
