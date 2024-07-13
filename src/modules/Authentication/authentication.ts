import { FastifyInstance } from "fastify";
import { signUpController } from "./controllers/sign-up";

export const AuthenticationModule = async (app: FastifyInstance) => {
  app.register(signUpController);
};
