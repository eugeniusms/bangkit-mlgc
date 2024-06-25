const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const InputError = require("../exceptions/InputError");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  if (!image) {
    throw new InputError("Image is required.");
  }

  const { model } = request.server.app;

  try {
    const { confidenceScore, label, explanation, suggestion } =
      await predictClassification(model, image._data);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      explanation: explanation,
      suggestion: suggestion,
      confidenceScore: confidenceScore,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message:
        confidenceScore > 99
          ? "Model is predicted successfully."
          : "Model is predicted successfully but under threshold. Please use the correct picture",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    throw new InputError(`Inference failed: ${error.message}`);
  }
}

module.exports = postPredictHandler;
