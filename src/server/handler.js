const crypto = require("crypto");
const loadModel = require("./loadModel");
const predictClassification = require("./inferenceService");
const storeData = require("./storeData");

async function predict(req, res) {
  const imageFile = req.file;
  const id = crypto.randomUUID();
  const model = await loadModel();
  try {
    const { confidenceScore } = await predictClassification(model, imageFile);
    const predictionResult = {
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
    res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
      data: predictionResult,
    });
  }
}

module.exports = {
  predict,
};
