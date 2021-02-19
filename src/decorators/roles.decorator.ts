import { SetMetadata } from "@nestjs/common";
import { Role } from "../constants/constants";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
