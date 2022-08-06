import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ICurrentUser } from 'src/commons/decorator/current-user';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  softDelete: jest.fn(),
});

describe('UserService', () => {
  const findOne = {
    id: 'asd1-asd4-asd1',
    name: '테스트',
    email: 'test@gmail.com',
    createdAt: '2022-07-27T08:32:50.701Z',
    updatedAt: '2022-07-27T08:32:50.701Z',
  };
  const save = {
    id: 'asd1-asd4-asd2',
    name: '테스트',
    email: 'test@gmail.com',
    createdAt: '2022-07-27T08:32:50.701Z',
    updatedAt: '2022-07-27T08:32:50.701Z',
  };

  const update = {
    id: 'asd1-asd4-asd1',
    name: '업데이트 데이터',
    email: 'test11@gmail.com',
    createdAt: '2022-07-27T08:32:50.701Z',
    updatedAt: '2022-07-27T08:32:50.701Z',
  };

  const createUserDto: CreateUserDto = {
    name: '테스트',
    email: 'test@gmail.com',
    password: 'test123456',
  };

  const updateUserDto: UpdateUserDto = {
    name: '업데이트 데이터',
  };

  const currentUser: ICurrentUser = {
    id: 'asd1-asd4-asd1',
  };

  const target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CreateUserDto,
    data: '',
  };

  let userService: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get('UserRepository') as MockRepository<User>;
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('유저 회원가입 성공', async () => {
      const userRepositorySpySave = jest.spyOn(userRepository, 'save');
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');

      //  userRepository.findOne.mockResolvedValue(false);
      userRepository.save.mockRejectedValue(save);
      userRepository.save.mockReturnValue(save);

      const result = await userService.signUp(createUserDto);

      expect(result).toEqual(save);
      expect(userRepositorySpySave).toHaveBeenCalledTimes(1);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });

    it('이메일 중복으로 인한 실패', async () => {
      const userRepositorySpySave = jest.spyOn(userRepository, 'save');
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');

      userRepository.findOne.mockResolvedValue(true);

      await expect(userService.signUp(createUserDto)).rejects.toThrowError(
        '이미 사용중인 이메일입니다.',
      );
      expect(userRepositorySpySave).toHaveBeenCalledTimes(0);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });

    it('비밀번호 유효성 검증 실패', async () => {
      createUserDto.password = '';

      await target.transform(createUserDto, metadata).catch((e) => {
        expect(e.response.message).toEqual([
          '비밀번호는 6~18자리의 영문 혹은 숫자의 조합만 가능합니다.',
          '최소 6자 이상이어야 합니다.',
          '공백으로 남겨놓으실 수 없습니다.',
        ]);
      });
    });

    it('이름 유효성 검증 실패', async () => {
      createUserDto.password = 'test123456';
      createUserDto.name = '';

      await target.transform(createUserDto, metadata).catch((e) => {
        expect(e.response.message).toEqual([
          '공백으로 남겨놓으실 수 없습니다.',
        ]);
      });
    });

    it('이메일 유효성 검증 실패', async () => {
      createUserDto.name = '테스트';
      createUserDto.email = '';

      await target.transform(createUserDto, metadata).catch((e) => {
        expect(e.response.message).toEqual([
          'email must be an email',
          '공백으로 남겨놓으실 수 없습니다.',
        ]);
      });
    });
  });

  describe('fetch', () => {
    it('유저 조회 성공', async () => {
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      userRepository.findOne.mockResolvedValue(findOne);

      const result = await userService.findOne(currentUser);

      expect(result).toEqual(findOne);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });

    it('유저 조회 실패', async () => {
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      userRepository.findOne.mockResolvedValue(false);

      await expect(userService.findOne(currentUser)).rejects.toThrowError(
        '유저 데이터가 존재하지 않습니다.',
      );
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('유저 업데이트 성공', async () => {
      const userRepositorySpySave = jest.spyOn(userRepository, 'save');
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      userRepository.findOne.mockResolvedValue(findOne);
      userRepository.save.mockResolvedValue(update);

      const result = await userService.update(currentUser, updateUserDto);

      expect(result).toEqual(update);
      expect(userRepositorySpySave).toHaveBeenCalledTimes(1);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });
    it('유저 업데이트 실패', async () => {
      const userRepositorySpySave = jest.spyOn(userRepository, 'save');
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      userRepository.findOne.mockResolvedValue(false);

      await expect(
        userService.update(currentUser, updateUserDto),
      ).rejects.toThrowError('유저 데이터가 존재하지 않습니다.');
      expect(userRepositorySpySave).toHaveBeenCalledTimes(0);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('delete', () => {
    it('유저 삭제 성공', async () => {
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      const userRepositorySpySoftDelete = jest.spyOn(
        userRepository,
        'softDelete',
      );

      userRepository.findOne.mockResolvedValue(findOne);
      userRepository.softDelete.mockResolvedValue(true);

      const result = await userService.delete(currentUser);

      expect(result).toEqual(false);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
      expect(userRepositorySpySoftDelete).toHaveBeenCalledTimes(1);
    });
    it('유저 삭제 실패', async () => {
      const userRepositorySpyFindOne = jest.spyOn(userRepository, 'findOne');
      const userRepositorySpySoftDelete = jest.spyOn(
        userRepository,
        'softDelete',
      );
      userRepository.findOne.mockResolvedValue(false);

      await expect(
        userService.update(currentUser, updateUserDto),
      ).rejects.toThrowError('유저 데이터가 존재하지 않습니다.');
      expect(userRepositorySpySoftDelete).toHaveBeenCalledTimes(0);
      expect(userRepositorySpyFindOne).toHaveBeenCalledTimes(1);
    });
  });
});
