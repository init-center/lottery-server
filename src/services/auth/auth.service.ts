import { Injectable, HttpStatus } from "@nestjs/common";
import { UsersService } from "../../services/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { encrypt } from "../../utils/encrypt";
import { UserEntity } from "src/entities/user.entity";

export interface Payload {
  id: number;
  name: string;
  role: number;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 用来验证用户的信息（比如登录时）
  async validateUser(phone: string, password: string) {
    const user = await this.usersService.findOneByPhone(phone);
    if (user) {
      const encryptedPwd = encrypt(password);
      if (encryptedPwd === user.password) {
        return {
          code: HttpStatus.OK,
          user: user,
        };
      }
      return { code: HttpStatus.UNAUTHORIZED };
    }

    return {
      code: HttpStatus.NOT_FOUND,
    };
  }

  async certificate(user: UserEntity) {
    const payload: Payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };

    try {
      const token = this.jwtService.sign(payload);
      return {
        code: HttpStatus.OK,
        data: {
          token,
        },
      };
    } catch (e) {
      return { code: HttpStatus.INTERNAL_SERVER_ERROR };
    }
  }
}
