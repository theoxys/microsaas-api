import prisma from "@/database/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";

export const adapter = new PrismaAdapter(prisma.session, prisma.user);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: false,
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}
