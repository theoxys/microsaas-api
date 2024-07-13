import { FastifyInstance } from "fastify";
import { GetUsersController } from "./controllers/get-users";

export const UsersModule = async (app: FastifyInstance) => {
  app.register(GetUsersController);
};
