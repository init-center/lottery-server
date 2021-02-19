import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (authorization && authorization.toString().split(" ")[0] === "Bearer") {
      const token = authorization.toString().split(" ")[1];

      try {
        const decoded = verify(token, jwtSecret, {
          maxAge: "48h",
        });
        request.user = decoded;
        return true;
      } catch (error) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "未登录或登录状态失效！",
        });
      }
    } else {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "未登录或登录状态失效！",
      });
    }
  }
}
