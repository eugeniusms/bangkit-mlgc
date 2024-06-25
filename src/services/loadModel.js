const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  const modelUrl =
    "https://storage.googleapis.com/model-storage-production-bucket/model-in-prod/model.json";

  try {
    const model = await tf.loadGraphModel(modelUrl);
    return model;
  } catch (error) {
    console.error("Error loading the model:", error);
    throw error;
  }
}

module.exports = loadModel;