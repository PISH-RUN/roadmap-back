module.exports = ({ env }) => ({
  otp: {
    enabled: true,
    resolve: "./src/plugins/otp",
    config: {
      requestInterval: Number(env("OTP_REQUEST_INTERVAL", 180)),
      tokenDuration: Number(env("OTP_TOKEN_DURATION", 3600)),
      token: {
        type: env("OTP_TOKEN_TYPE", "alphanumeric"),
        length: env("OTP_TOKEN_LENGTH", 4),
      },
    },
  },
});
