const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const classes = ["Cancer", "Non-cancer"];

    const prediction = model.predict(tensor);
    const score = await prediction.data();

    const confidenceScore = score[0] * 100;
    const label = score[0] > 0.5 ? classes[0] : classes[1];

    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    }

    if (label === "Non-cancer") {
      suggestion = "Selamat anda masih sehat!";
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    console.log(error);
    throw new InputError();
  }
}

module.exports = predictClassification;