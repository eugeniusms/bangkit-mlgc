const crypto = require("crypto");
const loadModel = require("../services/loadModel");
const predictClassification = require("../services/inferenceService");
const storeData = require("../services/storeData");

async function predict(req, res) {
  const imageFile = req.file;
  const id = crypto.randomUUID();
  let predictionResult; // Define predictionResult outside try-catch block

  try {
    const model = await loadModel();
    const { confidenceScore } = await predictClassification(model, imageFile);

    predictionResult = {
      id: id,
      result: confidenceScore > 0.5 ? "Cancer" : "Non-Cancer",
      suggestion:
        confidenceScore > 0.5
          ? "Segera periksa ke dokter!"
          : "Tidak kena kanker",
      createdAt: new Date().toISOString(),
    };

    await storeData(id, predictionResult);

    res.status(200).json({
      status: "success",
      message: "Model is predicted successfully",
      data: predictionResult,
    });
  } catch (error) {
    console.error("Error predicting:", error);
    res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
      data: predictionResult, // Use predictionResult even in error case
    });
  }
}

module.exports = {
  predict,
};
