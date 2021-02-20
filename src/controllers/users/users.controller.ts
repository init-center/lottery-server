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
  Req,
  Get,
} from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { ChangePasswordDto, CreateUserDto } from "../../dto/users/userDto";
import { UsersService } from "../../services/users/users.service";
import { Request } from "express";
import { Payload } from "src/services/auth/auth.service";
import { encrypt } from "src/utils/encrypt";

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

  @UseGuards(new AuthGuard())
  @Get("/auth")
  async authLogin() {
    return { statusCode: HttpStatus.OK, message: "验证登录状态成功！" };
  }

  @Put("/password")
  @UseGuards(new AuthGuard())
  async changePassword(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const phone = (request.user as Payload).phone;
    const user = await this.usersService.findOneByPhone(phone);
    const { newPassword, oldPassword } = body;
    if (!user) {
      throw new HttpException("用户不存在！", HttpStatus.NOT_FOUND);
    }

    const encryptedOldPass = encrypt(oldPassword);
    if (user.password !== encryptedOldPass) {
      throw new HttpException("旧密码错误！", HttpStatus.UNAUTHORIZED);
    }

    const encryptedNewPass = encrypt(newPassword);

    if (user.password === encryptedNewPass) {
      throw new HttpException("新密码不能与旧密码相同！", HttpStatus.CONFLICT);
    }
    const result = await this.usersService.changePassword(
      phone,
      encryptedNewPass,
    );
    if (!result.affected) {
      throw new HttpException("修改密码失败！", HttpStatus.BAD_REQUEST);
    }

    return { statusCode: HttpStatus.OK, message: "密码修改成功！" };
  }
}
