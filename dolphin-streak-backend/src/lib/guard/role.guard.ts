import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "src/lib/decorators/has-role.decorator";
import { Role } from "src/users/schemas/user.schema";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        // I dont really understand what this code do, but it will get the roles from the HasRoles decorator.
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLE_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        if (!requiredRoles) {
            return true; // If no roles are defined, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // The user should be added to the request by the JwtAuthGuard
        return requiredRoles.some((role) => role === user?.role);
    }
}
