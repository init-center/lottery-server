import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Put,
} from "@nestjs/common";
import { Role } from "src/constants/constants";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { CreateUserDto } from "../../dto/users/userDto";
import { UsersService } from "../../services/users/users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: CreateUserDto,
  ) {
    const user = await this.usersService.findOneByPhone(body.phone);
    if (user) {
      throw new HttpException("手机号已被使用", HttpStatus.CONFLICT);
    }
    const result = await this.usersService.create(body);
    if (!result) {
      throw new HttpException(
        "创建用户失败！",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { statusCode: HttpStatus.CREATED, message: "创建成功！" };
  }
}
