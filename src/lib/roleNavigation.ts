import { type UserRole } from "@/types/auth";

export function roleToPath(role: UserRole | null): string {
  switch (role) {
    case "ROLE_ADMIN":
      return "/admin";
    case "ROLE_VENDEDOR":
      return "/vendedor";
    default:
      return "/dashboard";
  }
}
