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

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    console.log("pred", prediction);
    console.log("classResult", classResult);
    console.log("label", label);
    console.log("score", score);

    const avg = Math.avg(...score);

    console.log("Avg", avg);

    if (avg > 0.5) {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    }

    console.log(result, suggestion);

    return { result, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
