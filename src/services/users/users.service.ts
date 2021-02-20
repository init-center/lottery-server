import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/constants/constants";
import { Repository } from "typeorm";
import { CreateUserDto, OperateAdminDto } from "../../dto/users/userDto";
import { UserEntity } from "../../entities/user.entity";
import { encrypt } from "../../utils/encrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async create(body: CreateUserDto) {
    const user = {
      name: body.name,
      phone: body.phone,
      password: encrypt(body.phone),
    };
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "创建失败！",
      });
    }
  }

  async addAdmin(body: OperateAdminDto) {
    const { phone, name } = body;
    const hasUser = await this.usersRepository.findOne({
      phone,
    });

    if (!hasUser) {
      const user = {
        name,
        phone,
        password: encrypt(phone),
        role: Role.ADMIN,
      };

      try {
        return await this.usersRepository.save(user);
      } catch (error) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "创建管理员失败！",
        });
      }
    } else {
      if (hasUser.role === Role.ADMIN) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: "用户已经是管理员！",
        });
      }
      try {
        return await this.usersRepository.update(
          {
            id: hasUser.id,
          },
          {
            role: Role.ADMIN,
          },
        );
      } catch (e) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "创建管理员失败！",
        });
      }
    }
  }

  async deleteAdmin(body: OperateAdminDto) {
    const { phone } = body;
    const hasUser = await this.usersRepository.findOne({
      phone,
    });

    if (!hasUser) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "用户不存在！",
      });
    } else {
      switch (hasUser.role) {
        case Role.DEFAULT:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: "用户不是管理员！",
          });
        case Role.SUPER_ADMIN:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            message: "超级管理员账户无法通过此方式撤销！",
          });
        case Role.ADMIN:
          try {
            return await this.usersRepository.update(
              {
                id: hasUser.id,
              },
              {
                role: Role.DEFAULT,
              },
            );
          } catch (e) {
            throw new BadRequestException({
              statusCode: HttpStatus.BAD_REQUEST,
              message: "撤销管理员失败！",
            });
          }
      }
    }
  }

  async findOneByPhone(phone: string) {
    try {
      return await this.usersRepository.findOne({
        phone,
      });
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "服务器错误！",
      });
    }
  }

  async findOneByPhoneAndName(phone: string, name: string) {
    try {
      return await this.usersRepository.findOne({
        phone,
        name,
      });
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "服务器错误！",
      });
    }
  }

  async changePassword(phone: string, newPassword: string) {
    try {
      return await this.usersRepository.update(
        {
          phone,
        },
        {
          password: newPassword,
        },
      );
    } catch (e) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "服务器错误！",
      });
    }
  }

  async findAllAdmins() {
    try {
      return await this.usersRepository.find({
        select: ["uid", "name", "role", "phone", "count"],
        where: [
          {
            role: Role.ADMIN,
          },
          {
            role: Role.SUPER_ADMIN,
          },
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "服务器错误！",
      });
    }
  }
}
