module.exports = [
    {
      method: "POST",
      path: "/auth/otp",
      handler: "auth.request",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
    {
      method: "POST",
      path: "/auth/local",
      handler: "auth.callback",
      config: {
        prefix: "",
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
  ];
  