import { Role } from "@prisma/client";
import { DEFAULT_ADMIN_EMAIL } from "@/lib/default-admin";

export function isAdminRole(role?: string | null) {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

export function isSuperAdminRole(role?: string | null) {
  return role === Role.SUPER_ADMIN;
}

export function getRoleForEmail(email: string) {
  return email === DEFAULT_ADMIN_EMAIL ? Role.SUPER_ADMIN : Role.USER;
}

export function canManageRoles(role?: string | null) {
  return isSuperAdminRole(role);
}

