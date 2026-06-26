export type UserRole = "ROLE_ADMIN" | "ROLE_VENDEDOR" | "ROLE_USER";

export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}
