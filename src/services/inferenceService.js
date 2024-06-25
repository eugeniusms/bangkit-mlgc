const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    // const confidenceScore = Math.max(...score) * 100;
    let result = "Non-cancer";
    let suggestion = "Anda baik-baik saja!";

    console.log("score", score);

    const avg = Math.avg(...score);
    if (avg > 0.5) {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    }

    return { result, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
