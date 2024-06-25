const postPredictHandler = require("../server/handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 10485760, // 10 MB limit
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
];

module.exports = routes;
