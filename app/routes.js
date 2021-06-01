import express from 'express';
import {
  ErrorContext, errorHandler, healthRoutes, cookiePolicyAgreed, cookiePolicyExists,
  consentCookieExpiration,
} from 'buying-catalogue-library';
import { logger } from './logger';
import supplierRoutes from './pages/supplier/routes';
import authorityRoutes from './pages/authority/routes';
import includesContext from './includes/manifest.json';
import { getHealthCheckDependencies } from './common/helpers/routerHelper';

const router = express.Router();
const config = require('./config');

const addContext = ({ context, req }) => ({
  ...context,
  ...includesContext,
  config,
  showCookieBanner: !cookiePolicyExists({ req, logger }),
});

healthRoutes({ router, dependencies: getHealthCheckDependencies(), logger });

consentCookieExpiration({ router, logger });

router.get('/dismiss-cookie-banner', (req, res) => {
  cookiePolicyAgreed({ res, logger });
  res.redirect(req.headers.referer);
});

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
  return res.render('pages/error/template.njk', addContext({ context, req }));
});

module.exports = router;
