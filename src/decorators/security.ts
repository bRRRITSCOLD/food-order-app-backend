// node_modules
import { createMethodDecorator } from 'type-graphql';
import { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';

// libraries
import { jwt } from '../lib/util';

/**
 *
 *
 * @export
 * @returns {MethodAndPropDecorator}
 */
export function ScopeAuthorization(): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...roles: RoleType[]): MethodAndPropDecorator;
export function ScopeAuthorization<RoleType = string>(...rolesOrRolesArray: RoleType[]): MethodDecorator | PropertyDecorator {
  return createMethodDecorator(async (ctx: any, next) => {
    jwt.roles(ctx.context.reply.request.headers.authorization, (rolesOrRolesArray[0] as unknown) as string[]);
    return next();
  });
}

/**
 *
 *
 * @export
 * @returns {MethodAndPropDecorator}
 */
export function JWTAuthorization(): MethodAndPropDecorator;
export function JWTAuthorization(): MethodDecorator | PropertyDecorator {
  return createMethodDecorator(async (ctx: any, next) => {
    jwt.verify(ctx.context.reply.request.headers.authorization);
    return next();
  });
}
