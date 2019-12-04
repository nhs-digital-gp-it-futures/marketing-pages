module.exports = {
  // App name
  appName: 'NHSD Marketing Pages',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3001,

  // API_HOST
  apiHost: process.env.API_HOST || 'http://localhost:8080/api/v1',
};
