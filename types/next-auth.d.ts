import "next-auth";
import { Admin, Department, Mayor, Order, Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      department: Department;
      roles: Role[];
      balance?: number;
      createdAt: Date;
      updatedAt: Date;
      admin?: Admin;
      mayor: Mayor[];
    } & DefaultSession["user"];
  }
}
