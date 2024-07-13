import { FastifyInstance } from "fastify";
import prisma from "@/database/prisma";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Group } from "@prisma/client";

const responseType = z.object({
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.date(),
    })
  ),
});

export const ListGroupsController = async (server: FastifyInstance) => {
  server.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "List Groups",
        description: "List all groups",
        tags: ["Groups"],
        response: {
          200: responseType,
        },
      },
    },
    async (request, reply) => {
      const group = await prisma.group.findMany();
      reply
        .code(200)
        .send({ message: "Groups fetched successfully", data: group });
    }
  );
};
