module.exports = {
  // App name
  appName: 'NHSD Marketing Pages',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3002,

  // API_HOST
  buyingCatalogueApiHost: process.env.API_HOST || 'http://localhost:5100',

  // DOCUMENT_HOST
  documentApiHost: process.env.DOCUMENT_HOST || 'http://localhost:5101',

  // LOGGER_LEVEL options are info, warn, error, off
  loggerLevel: process.env.LOGGER_LEVEL || 'error',
};
