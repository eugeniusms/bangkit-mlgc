require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  try {
    const server = Hapi.server({
      port: 3000,
      host: "0.0.0.0",
      routes: {
        cors: {
          origin: ["*"],
        },
      },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext("onPreResponse", function (request, h) {
      const response = request.response;

      if (response instanceof InputError) {
        const newResponse = h.response({
          status: "fail",
          message: `${response.message} Silakan gunakan foto lain.`,
        });
        // Ensure statusCode is an integer
        const statusCode = parseInt(response.statusCode, 10);
        if (isNaN(statusCode)) {
          console.error("Invalid status code:", response.statusCode);
          return h
            .response({ status: "error", message: "Internal Server Error" })
            .code(500);
        }
        newResponse.code(statusCode);
        return newResponse;
      }

      if (response.isBoom) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        // Ensure statusCode is an integer
        const statusCode = parseInt(response.output.statusCode, 10);
        if (isNaN(statusCode)) {
          console.error("Invalid status code:", response.output.statusCode);
          return h
            .response({ status: "error", message: "Internal Server Error" })
            .code(500);
        }
        newResponse.code(statusCode);
        return newResponse;
      }

      return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
})();
