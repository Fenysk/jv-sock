import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        const { user } = context.switchToHttp().getRequest();

        if (!requireRoles) {
            return true;
        }

        if (!user) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à effectuer cette action.");
        }

        const isUserHasRole = requireRoles.some((role) => user.roles?.includes(role));

        if (!isUserHasRole) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à effectuer cette action.");
        }

        return isUserHasRole;
    }
}