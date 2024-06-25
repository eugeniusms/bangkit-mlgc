const multer = require("multer");
const handler = require("./handler");

const upload = multer({
  limits: { fileSize: 1000000 },
});

module.exports = function (app) {
  app.post("/predict", upload.single("image"), handler.predict);
};
