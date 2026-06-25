import { type UserRole } from "@/types/auth";

export function createTestJwt(
  role: UserRole,
  email = "user@email.com",
  expiresIn = 9999999999
): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ sub: email, role, iat: 1000000, exp: expiresIn })
  );
  return `${header}.${payload}.fakesignature`;
}

export function createExpiredTestJwt(role: UserRole): string {
  return createTestJwt(role, "user@email.com", 1);
}
