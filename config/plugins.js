module.exports = ({ env }) => ({
  sms: {
    enabled: true,
    resolve: "./src/plugins/sms",
    config: {
      provider: env("SMS_PROVIDER", "ghasedak"),
      providersOptions: {
        ghasedak: {
          apiKey: env("GHASEDAK_API_KEY"),
        },
      },
    },
  },
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
  socketio: {
    enabled: true,
    resolve: "./src/plugins/socketio",
    config: {
      options: {
        cors: {
          origin: env("SOCKET_ORIGIN", "http://localhost:3000").split(","),
          credentials: true,
        },
      },
    },
  },
});
