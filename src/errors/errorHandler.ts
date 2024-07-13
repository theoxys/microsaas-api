import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { UnauthorizedError } from "./unauthorized.error";
import { BadRequestError } from "./badRequest.error";
import { fromError } from "zod-validation-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];
export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    const validationError = fromError(error, {
      prefix: null,
    });
    return reply.status(400).send({
      error: "Validation Error",
      message: validationError.toString().replace(/"/g, "|"),
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply
      .status(401)
      .send({ error: "Unauthorized", message: error.message });
  }

  if (error instanceof BadRequestError) {
    console.log("Bad Error");
    return reply
      .status(400)
      .send({ error: "Bad Request", message: error.message });
  }

  console.error("UNHANDLED ERROR: ", error);

  // TODO: Send the error to observability service

  return reply.status(500).send({
    error: "Internal Server Error",
    message: "See logs for more details",
  });
};
