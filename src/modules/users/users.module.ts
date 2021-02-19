import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "../../services/users/users.service";
import { UsersController } from "../../controllers/users/users.controller";
import { SessionsController } from "../../controllers/sessions/sessions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../modules/auth/auth.module";
import { UserEntity } from "../../entities/user.entity";
import { AdminsController } from "../../controllers/admins/admins.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController, SessionsController, AdminsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
