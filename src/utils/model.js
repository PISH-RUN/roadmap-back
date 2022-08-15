async function getModelFieldsEnum(uid, field) {
  const model = await strapi.getModel(uid);
  if (!model) {
    throw new Error(`Model not found ${uid}`);
  }
  return model.attributes[field].enum;
}

module.exports = {
  getModelFieldsEnum,
};
