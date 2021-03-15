require('dotenv').config();
const { ConfigHelper } = require('buying-catalogue-library');
const routes = require('./routes');
const config = require('./config');
const { App } = require('./app');
const { logger } = require('./logger');

Object.keys(config).map((configKey) => {
  if (config[configKey]) {
    const value = ConfigHelper.getConfigKeyValue(configKey, config[configKey]);
    logger.info(`${configKey} set to ${value}`);
  } else {
    logger.error(`${configKey} not set.`);
  }
});

// Routes
const app = new App().createApp();
app.use(config.baseUrl, routes);

// Run application on configured port
if (config.env === 'development') {
  logger.info(` Marketing Pages - \x1b[35m${config.appBaseUri}${config.baseUrl}/supplier/solution/100000-001\x1b[0m`);
} else {
  logger.info(`App listening on port ${config.port} - Marketing Pages`);
}
app.listen(config.port);
