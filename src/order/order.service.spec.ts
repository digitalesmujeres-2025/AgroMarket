import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

describe('OrderService', () => {
  let service: OrderService;
  const repo = {
    createOrder: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, { provide: OrderRepository, useValue: repo }],
    }).compile();
    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('createOrderService delega al repositorio', async () => {
    (repo.createOrder as any).mockResolvedValue({ uuid_order: '1' });
    const res = await service.createOrderService({
      user_id: 'u',
      total: 1,
      shipping_price: 0,
      pay_method: 'cash',
    } as any);
    expect(res.uuid_order).toBe('1');
  });

  it('update lanza error cuando no existe', async () => {
    (repo.getById as any).mockResolvedValue(null);
    await expect(service.update('x', {} as any)).rejects.toThrow(
      'Orden no encontrada',
    );
  });

  it('delete lanza error cuando no existe', async () => {
    (repo.getById as any).mockResolvedValue(null);
    await expect(service.delete('x')).rejects.toThrow('Orden no encontrada');
  });
});
