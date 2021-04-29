import express from 'express';
import { ErrorContext, errorHandler, healthRoutes } from 'buying-catalogue-library';
import { logger } from './logger';
import supplierRoutes from './pages/supplier/routes';
import authorityRoutes from './pages/authority/routes';
import includesContext from './includes/manifest.json';
import { getHealthCheckDependencies } from './common/helpers/routerHelper';

const router = express.Router();
const config = require('./config');

const addContext = ({ context }) => ({
  ...context,
  ...includesContext,
  config,
});

healthRoutes({ router, dependencies: getHealthCheckDependencies(), logger });

router.use('/supplier', supplierRoutes);

router.use('/authority', authorityRoutes);

router.get('*', (req) => {
  throw new ErrorContext({
    status: 404,
    title: `Incorrect url ${req.originalUrl}`,
    description: 'Please check it is valid and try again',
  });
});

errorHandler(router, (error, req, res) => {
  logger.error(`${error.title} - ${error.description}`);
  const context = {
    ...error,
    isDevelopment: config.isDevelopment(),
  };
  return res.render('pages/error/template.njk', addContext({ context }));
});

module.exports = router;
