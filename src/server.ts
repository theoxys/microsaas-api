import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  validatorCompiler,
  ZodTypeProvider,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { GroupModule } from "./modules/Groups";
import fastifySwagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import { errorHandler } from "./errors/errorHandler";
import { AuthenticationModule } from "./modules/Authentication/authentication";
import { UsersModule } from "./modules/Users/users";
import { signUpController } from "./modules/Authentication/controllers/sign-up";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Saas Scaffold API",
      description: "Saas Scaffold is a scaffold for a SaaS application",
      version: "1.0.0",
    },
    servers: [],
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifyScalar, {
  routePrefix: "/docs",
  configuration: {
    spec: {
      content: () => app.swagger(),
    },
  },
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(AuthenticationModule, { prefix: "/auth" });
app.register(UsersModule, { prefix: "/users" });
app.register(GroupModule, { prefix: "/groups" });

app.listen({ port: 4622 });
console.log("Server is running on port 4622 🚀");
