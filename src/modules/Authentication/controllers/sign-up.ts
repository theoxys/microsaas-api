import { FastifyInstance } from "fastify";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import prisma from "@/database/prisma";
import { BadRequestError } from "@/errors/badRequest.error";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
});

const responseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string().cuid(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date(),
  }),
});

export const signUpController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sign-up",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Sign Up",
        description: "Sign up a new user",
        body: bodySchema,
        response: {
          201: responseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password, name } = bodySchema.parse(request.body);

      // Verifica se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new BadRequestError("User already exists");
      }

      // Criptografa a senha
      const argon2 = new Argon2id();
      const passwordHash = await argon2.hash(password);

      // Cria o usuário
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });

      reply.status(201).send({
        message: "User created successfully",
        data: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          createdAt: createdUser.createdAt,
        },
      });
    }
  );
};
