require('dotenv').config();
const routes = require('./routes');
const config = require('./config');
const { App } = require('./app');
const { logger } = require('./logger');

Object.keys(config).map((configKey) => {
  if (config[configKey]) {
    logger.info(`${configKey} set to ${config[configKey]}`);
  } else {
    logger.error(`${configKey} not set`);
  }
});

// Routes
const app = new App().createApp();
app.use('/', routes);
if (config.env === 'development') {
  logger.info(` Marketing Pages - \x1b[35m${config.appBaseUri}/supplier/solution/100000-001\x1b[0m`);
} else {
  logger.info(`App listening on port ${config.port} - Marketing Pages`);
}
app.listen(config.port);
