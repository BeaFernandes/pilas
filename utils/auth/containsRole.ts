import { Department, Role, User } from "@prisma/client";
import { Session } from "next-auth";

export type ComposedUser = User & {
  roles: Array<Role>,
  department: Department,
}

export default function containsRole(
  user: Session["user"] | ComposedUser | undefined,
  role: "ADMIN" | "MAYOR"
) {
  if (!user) return false;
  return user.roles.find((userRole) => userRole.title === role) != undefined;
}
