import prisma from "@/database/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const responseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.date(),
});

export const GetUsersController = async (app: FastifyInstance) => {
  app.get(
    "/",
    {
      schema: {
        tags: ["Users"],
        summary: "Get users",
        description: "Get all registered users",
        response: {
          200: z.array(responseSchema),
        },
      },
    },
    async (request, reply) => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      reply.status(200).send(users);
    }
  );
};
