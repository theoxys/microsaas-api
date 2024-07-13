import { FastifyInstance } from "fastify";
import prisma from "@/database/prisma";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const bodySchema = z.object({
  name: z.string(),
});

const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
});

export const CreateGroupController = async (server: FastifyInstance) => {
  server.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Create Group",
        description: "Create a new group",
        tags: ["Groups"],
        body: bodySchema,
        response: {
          201: responseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name } = bodySchema.parse(request.body);

      const group = await prisma.group.create({ data: { name } });
      reply.status(201).send(group);
    }
  );
};
