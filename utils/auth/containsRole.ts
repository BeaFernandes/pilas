import { Session } from "next-auth";

export default function containsRole(
  user: Session["user"] | undefined,
  role: "ADMIN" | "MAYOR"
) {
  if (!user) return false;
  return user.roles.find((userRole) => userRole.title === role) != undefined;
}
