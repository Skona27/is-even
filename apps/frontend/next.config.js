module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    SENTRY_DSN: process.env.SENTRY_DSN,
    APP_VERSION: process.env.npm_package_version,
    API_BASE_URL: process.env.API_BASE_URL,
  },
};
