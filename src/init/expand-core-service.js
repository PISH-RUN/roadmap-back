const _ = require("lodash");
const { createCoreService } = require("@strapi/strapi").factories;

const expandMethods = {
  findOneBy,
  updateOrCreate,
  firstOrCreate,
};

require.cache[
  require.resolve("@strapi/strapi")
].exports.factories.createCoreService = (uid, cfg = {}) => {
  return ({ strapi }) => {
    const originService = createCoreService(uid)({ strapi });
    let userService = typeof cfg === "function" ? cfg({ strapi }) : cfg;

    for (let [methodName, method] of Object.entries(expandMethods)) {
      if (methodName in userService) {
        continue;
      }

      originService[methodName] = method(uid);
    }

    return originService;
  };
};

function findOneBy(uid) {
  return async function findOneBy(where, options) {
    const query = strapi.query(uid);
    const found = await query.findOne({ where });

    if (!found) {
      return null;
    }

    const service = createCoreService(uid)({ strapi });
    return await service.findOne(found.id, options);
  };
}

function updateOrCreate(uid) {
  return async function upadteOrCraete(queryParams, updateParams, options) {
    const query = strapi.query(uid);
    const service = strapi.service(uid);

    const found = await query.findOne({ where: queryParams });

    if (found) {
      return await service.update(found.id, { data: updateParams, ...options });
    }

    return await service.create({
      data: { ...queryParams, ...updateParams },
      ...options,
    });
  };
}

function firstOrCreate(uid) {
  return async function firstOrCreate(
    queryParams,
    createParams = {},
    options = {}
  ) {
    const { isolate, ...restOptions } = options;

    const found = await strapi
      .query(uid)
      .findOne({ where: queryParams, ...restOptions });

    if (found) {
      return found;
    }

    let data = { ...createParams };

    if (
      !isolate &&
      !Object.entries(queryParams).some(([key, value]) => _.isObject(value))
    ) {
      data = { ...data, ...queryParams };
    }

    return await strapi.service(uid).create({ data, ...options });
  };
}
