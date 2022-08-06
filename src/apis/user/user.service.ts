import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ICurrentUser } from 'src/commons/decorator/current-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * @description 유저를 생성합니다.
   * 
     @param createUserDto 생성할 유저 정보
   * @returns {Promise<User>} 생성된 유저의 정보를 반환합니다.
   */

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;

    const userExists = await this.userRepository.findOne({ where: { email } });

    try {
      if (userExists) throw new ConflictException();

      const result = await this.userRepository.save({
        email,
        name,
        password: await bcrypt.hash(password, 10),
      });

      delete result.password;

      return result;
    } catch (e) {
      if ((e.status = 409 || e.code === 'ER_DUP_ENTRY'))
        throw new ConflictException('이미 사용중인 이메일입니다.');
      throw e;
    }
  }

  /**
   * @description 모든 유저를 조회합니다.
   *
   * @returns {Promise<User[]>} 유저들의 정보를 반환합니다.
   */

  async findAll(): Promise<User[]> {
    const results = await this.userRepository.find();

    try {
      if (results.length === 0)
        throw new NotFoundException('유저 데이터가 존재하지 않습니다.');

      return results;
    } catch (e) {
      if (e.status === 404) return e;
      return e;
    }
  }

  /**
   * @description 유저를 조회합니다.
   *
   * @param currentUser
   * @returns {Promise<User>} 유저 정보를 반환합니다.
   */

  async findOne(currentUser: ICurrentUser): Promise<User> {
    const isUser = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });
    try {
      if (!isUser)
        throw new NotFoundException('유저 데이터가 존재하지 않습니다.');

      delete isUser.password;

      return isUser;
    } catch (e) {
      if (e.status === 404) throw e;
      throw e;
    }
  }

  /**
   * @description 유저를 조회합니다.
   *
   * @param currentUser 유저의 id
   * @param updateUserDto 업데이트를 할 유저의 정보
   * @returns {Promise<User>} 유저 정보를 반환합니다.
   */
  async update(
    currentUser: ICurrentUser,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { name } = updateUserDto;

    const isUser = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });

    try {
      if (!isUser)
        throw new NotFoundException('유저 데이터가 존재하지 않습니다.');

      const result = await this.userRepository.save({
        ...isUser,
        name: name,
      });

      delete result.password;

      return result;
    } catch (e) {
      if (e.status === 404) throw e;
      throw e;
    }
  }

  /**
   * @description 유저의 정보를 삭제합니다.
   *
   * @param currentUser 유저의 id
   * @returns {Promise<boolean>} 유저 정보를 반환합니다.
   */
  async delete(currentUser: ICurrentUser): Promise<boolean> {
    const isUser = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });

    try {
      if (!isUser)
        throw new NotFoundException('유저 데이터가 존재하지 않습니다.');

      const deletedResult = await this.userRepository.softDelete({
        id: currentUser.id,
      });

      return deletedResult ? false : true;
    } catch (e) {
      if (e.status === 404) throw e;
      throw e;
    }
  }
}
