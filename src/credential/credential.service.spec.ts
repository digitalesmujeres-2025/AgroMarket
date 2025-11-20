import { Test, TestingModule } from '@nestjs/testing';
import { CredentialService } from './credential.service';
import { CredentialRepository } from './repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CredentialService', () => {
  let service: CredentialService;
  const repo = {
    getAllCredentialsRepository: jest.fn(),
    getCredentialByNameRepository: jest.fn(),
    getCredentialByIdRepository: jest.fn(),
    findByUserName: jest.fn(),
    updateCredentialRepository: jest.fn(),
  } as unknown as CredentialRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialService,
        { provide: CredentialRepository, useValue: repo },
      ],
    }).compile();
    service = module.get<CredentialService>(CredentialService);
    jest.clearAllMocks();
  });

  it('updateCredentialService lanza NotFound si no existe', async () => {
    (repo.getCredentialByIdRepository as any).mockResolvedValue(null);
    await expect(
      service.updateCredentialService({ uuid: 'x' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateCredentialService lanza Conflict si user_name ya existe', async () => {
    (repo.getCredentialByIdRepository as any).mockResolvedValue({ uuid: '1' });
    (repo.findByUserName as any).mockResolvedValue({ uuid: '2' });
    await expect(
      service.updateCredentialService({ uuid: '1', user_name: 'u' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('updateCredentialService actualiza si válido', async () => {
    (repo.getCredentialByIdRepository as any).mockResolvedValue({ uuid: '1' });
    (repo.findByUserName as any).mockResolvedValue(null);
    (repo.updateCredentialRepository as any).mockResolvedValue({
      uuid: '1',
      user_name: 'ok',
    });
    const res = await service.updateCredentialService({
      uuid: '1',
      user_name: 'ok',
    } as any);
    expect(res.user_name).toBe('ok');
  });
});
