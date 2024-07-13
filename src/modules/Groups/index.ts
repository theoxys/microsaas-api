import { FastifyInstance } from "fastify";
import { CreateGroupController } from "./controllers/create-group";
import { ListGroupsController } from "./controllers/list-groups";

export const GroupModule = async (server: FastifyInstance) => {
  server.register(CreateGroupController);
  server.register(ListGroupsController);
};
