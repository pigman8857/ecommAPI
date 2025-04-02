import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, mixin } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from 'express';

export const AuthorizationGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
      canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest() as Request;
      const result = request?.currentUser.roles
        .map((role: string) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);

      if(result) return true;

      throw new UnauthorizedException('Sorry, you are not authorized.');
    }
  }

  const guard = mixin(RolesGuardMixin)

  return guard;
}


// @Injectable()
// export class AuthorizationGuard implements CanActivate {

//   constructor(private reflector: Reflector){

//   }

//   canActivate(context: ExecutionContext): boolean {
//     const allowedRoles = this.reflector.get<string[]>('allowedRoles',context.getHandler());
//     const request = context.switchToHttp().getRequest() as Request;
//     const result = request?.currentUser.roles
//       .map((role: string) => allowedRoles.includes(role))
//       .find((val: boolean) => val === true);

//     if(result) return true;

//     throw new UnauthorizedException('Sorry, you are not authorized.');
//   }
// }