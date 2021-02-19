import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpCode,
} from "@nestjs/common";
import { LoginDto } from "src/dto/users/userDto";
import { AuthService } from "src/services/auth/auth.service";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: LoginDto,
  ) {
    const authResult = await this.authService.validateUser(
      body.phone,
      body.password,
    );
    switch (authResult.code) {
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "用户不存在！",
        });
      case HttpStatus.UNAUTHORIZED:
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "用户名或密码错误！",
        });
      case HttpStatus.OK:
        const loginResult = await this.authService.certificate(authResult.user);
        if (loginResult.code === HttpStatus.INTERNAL_SERVER_ERROR) {
          throw new InternalServerErrorException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "服务器错误！",
          });
        }
        return {
          statusCode: HttpStatus.OK,
          data: loginResult.data,
          message: "登录成功！",
        };
    }
  }
}
