import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/schemas/user.schema";

export const ROLE_KEY = "roles";
export const HasRoles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
