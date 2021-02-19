import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  Put,
  Delete,
} from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { RoleGuard } from "../../guards/role.guard";
import {
  AddDrawCountDto,
  AddPrizeDto,
  DeletePrizeDto,
  GetDrawCountDto,
  GetWinRecordDto,
  RandomPrizeDto,
} from "../../dto/lotteries/lotteryDto";
import { LotteriesService } from "../../services/lotteries/lotteries.service";
import { UsersService } from "../../services/users/users.service";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/constants/constants";

@Controller("lotteries")
export class LotteriesController {
  constructor(
    private readonly lotteriesService: LotteriesService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post()
  async addPrize(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: AddPrizeDto,
  ) {
    const newPrize = await this.lotteriesService.addPrize(body);
    if (!newPrize) {
      throw new HttpException(
        "新增奖品失败！",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { statusCode: HttpStatus.CREATED, message: "新增奖品成功！" };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete()
  async deletePrize(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: DeletePrizeDto,
  ) {
    const deleteResult = await this.lotteriesService.deletePrize(body);
    if (!deleteResult.affected) {
      throw new HttpException(
        "删除奖品失败！",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { statusCode: HttpStatus.OK, message: "删除奖品成功！" };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Put("count")
  async addDrawCount(
    @Body(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    body: AddDrawCountDto,
  ) {
    const updateResult = await this.lotteriesService.addDrawCount(body);
    if (!updateResult) {
      throw new HttpException("增加抽奖次数失败！", HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      message: "增加抽奖次数成功！",
    };
  }

  @UseGuards(new AuthGuard(), RoleGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get("prizes")
  async findAllPrizes() {
    const allPrizes = await this.lotteriesService.findAllPrizes();
    if (!allPrizes) {
      throw new HttpException("获取奖品列表失败！", HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      data: allPrizes,
      message: "获取奖品列表成功！",
    };
  }

  @Get("count")
  async getDrawCount(
    @Query(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    query: GetDrawCountDto,
  ) {
    const user = await this.lotteriesService.getDrawCount(query);
    if (!user) {
      throw new HttpException("查询抽奖次数失败！", HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      data: user,
      message: "查询抽奖次数成功！",
    };
  }

  @Get()
  async randomPrize(
    @Query(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    query: RandomPrizeDto,
  ) {
    const user = await this.usersService.findOneByPhoneAndName(
      query.phone,
      query.name,
    );
    if (!user) {
      throw new HttpException("用户信息有误或不存在！", HttpStatus.CONFLICT);
    }

    if (user.count < 1) {
      throw new HttpException("抽奖次数不足！", HttpStatus.FORBIDDEN);
    }
    const result = await this.lotteriesService.randomPrize(user);

    return {
      statusCode: HttpStatus.OK,
      data: result,
      message: "抽奖成功！",
    };
  }

  @Get("records")
  async getWinRecord(
    @Query(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    query: GetWinRecordDto,
  ) {
    const user = await this.usersService.findOneByPhone(query.phone);
    if (!user) {
      throw new HttpException("用户信息有误或不存在！", HttpStatus.CONFLICT);
    }

    const record = await this.lotteriesService.findWinRecordByPhone(query);
    if (!record) {
      throw new HttpException("查询中奖记录失败！", HttpStatus.BAD_REQUEST);
    }
    return {
      statusCode: HttpStatus.OK,
      data: record,
      message: "查询中奖记录成功！",
    };
  }
}
