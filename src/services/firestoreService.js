const db = require("../libs/firestore");

const storeData = async (id, data) => {
  const predictCollection = db.collection("predictions");

  return predictCollection.doc(id).set(data);
};

const getAllData = async () => {
  const predictCollection = db.collection("predictions");

  const snapshot = await predictCollection.get();

  if (snapshot.empty) {
    return [];
  }

  const data = [];

  snapshot.forEach((doc) => {
    data.push({ id: doc.id, history: { ...doc.data() } });
  });

  return data;
};

module.exports = { storeData, getAllData };
