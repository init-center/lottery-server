import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { Role } from "src/constants/constants";
import { Roles } from "src/decorators/roles.decorator";
import { OperateAdminDto } from "src/dto/users/userDto";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { UsersService } from "src/services/users/users.service";

@Controller("admins")
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN)
  @Put()
  @HttpCode(HttpStatus.CREATED)
  async addAdmin(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: OperateAdminDto,
  ) {
    const result = await this.usersService.addAdmin(body);
    if (!result) {
      throw new HttpException(
        "创建管理员失败！",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { statusCode: HttpStatus.CREATED, message: "创建管理员成功！" };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get("/auth")
  async authAdmin() {
    return { statusCode: HttpStatus.OK, message: "验证管理员成功！" };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  async getAllAdmins() {
    const result = await this.usersService.findAllAdmins();
    if (!result) {
      throw new HttpException("获取管理员列表失败！", HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.CREATED,
      data: result,
      message: "获取管理员列表成功！",
    };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete()
  async deleteAdmin(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: OperateAdminDto,
  ) {
    const result = await this.usersService.deleteAdmin(body);
    if (!result) {
      throw new HttpException("撤销管理员失败！", HttpStatus.BAD_REQUEST);
    }

    return {
      statusCode: HttpStatus.OK,
      message: "撤销管理员成功！",
    };
  }
}
