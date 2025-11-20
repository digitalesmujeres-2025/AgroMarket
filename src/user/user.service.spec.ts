import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repository';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  const repo = {
    getAllUsersRepository: jest.fn(),
    getUserByNameRepository: jest.fn(),
    getUserByIdRepository: jest.fn(),
    findCredentialByUserName: jest.fn(),
    findUserByEmail: jest.fn(),
    createUserRepository: jest.fn(),
    updateUserRepository: jest.fn(),
    deleteUserRepository: jest.fn(),
  } as unknown as UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: repo }],
    }).compile();
    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('getUserByNameService lanza NotFound si vacío', async () => {
    (repo.getUserByNameRepository as any).mockResolvedValue([]);
    await expect(service.getUserByNameService('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('createUserService lanza BadRequest si ya existe username o email', async () => {
    (repo.findCredentialByUserName as any).mockResolvedValue({});
    (repo.findUserByEmail as any).mockResolvedValue(null);
    await expect(
      service.createUserService({ user_name: 'u', email: 'e' } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updateUserService lanza NotFound si no existe', async () => {
    (repo.getUserByIdRepository as any).mockResolvedValue(null);
    await expect(
      service.updateUserService({ uuid_user: 'x' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
