import { Module } from "@nestjs/common";
import { LotteriesService } from "../../services/lotteries/lotteries.service";
import { UsersService } from "../../services/users/users.service";
import { LotteriesController } from "../../controllers/lotteries/lotteries.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrizeEntity } from "../../entities/prize.entity";
import { UserEntity } from "../../entities/user.entity";
import { RecordEntity } from "../../entities/record.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PrizeEntity, UserEntity, RecordEntity])],
  controllers: [LotteriesController],
  providers: [LotteriesService, UsersService],
})
export class LotteriesModule {}
