"use strict";

const bcrypt = require("bcryptjs");

// dates
const addSeconds = require("date-fns/addSeconds");
const isDatePast = require("date-fns/isPast");
const diffInSeconds = require("date-fns/differenceInSeconds");

// utils
const getConfig = require("../utils/get-config");
const random = require("../utils/random");
const { otpQuery } = require("../utils/queries");
const { otpService, userService } = require("../utils/services");

// errors
const { TooFastError } = require("../errors");

const GENERATE_DEFAULT_OPTIONS = { ignoreStaticPassword: false };
module.exports = ({ strapi }) => ({
  async generate(user, options) {
    const config = getConfig();
    const { ignoreStaticPassword } = {
      ...GENERATE_DEFAULT_OPTIONS,
      ...options,
    };

    if (user.password && !ignoreStaticPassword) {
      return null;
    }

    const result = await (async () => {
      const otp = await otpQuery(strapi).findOne({ where: { user: user.id } });
      const data = otpData(config);

      if (!otp) {
        await otpService(strapi).create({
          data: {
            ...data,
            user: user.id,
          },
        });

        return data;
      }

      checkWaitingTime(otp, config);

      await otpService(strapi).update(otp.id, {
        data,
      });

      return data;
    })();

    await strapi.plugin("otp").notify(user, result.token);

    return result.token;
  },

  async validate(user, token) {
    const otp = await otpQuery(strapi).findOne({ where: { user: user.id } });

    if (!otp) {
      return false;
    }

    if (isDatePast(new Date(otp.expiresAt))) {
      return false;
    }

    const isValid = bcrypt.compare(token, otp.token);

    if (isValid) {
      await otpService(strapi).delete(otp.id);
    }

    return isValid;
  },

  async validatePassword(user, password) {
    let validPassword;
    if (user.password) {
      validPassword = await userService().validatePassword(
        password,
        user.password
      );
    }

    if (!validPassword) {
      validPassword = await this.validate(user, password);
    }

    if (!validPassword) {
      return false;
    }

    return true;
  },
});

function checkWaitingTime(otp, config) {
  let waitingSeconds = diffInSeconds(
    addSeconds(new Date(otp.updatedAt), config.requestInterval),
    new Date()
  );

  if (waitingSeconds > 0) {
    throw new TooFastError(`you need to wait ${waitingSeconds} seconds`, {
      waitingSeconds,
    });
  }
}

function otpData(config) {
  const token = random(config.token);
  return { token, expiresAt: addSeconds(new Date(), config.tokenDuration) };
}
