import express from 'express';
import { logger } from './logger';
import { errorHandler } from './pages/error/errorHandler';
import healthRoutes from './pages/health/routes';
import supplierRoutes from './pages/supplier/routes';
import authorityRoutes from './pages/authority/routes';
import includesContext from './includes/manifest.json';

const router = express.Router();
const config = require('./config');

const addContext = ({ context }) => ({
  ...context,
  ...includesContext,
  config,
});

router.use('/health', healthRoutes);

router.use('/supplier', supplierRoutes);

router.use('/authority', authorityRoutes);

router.get('*', (req, res, next) => next({
  status: 404,
  message: `Incorrect url ${req.originalUrl} - please check it is valid and try again`,
}));

router.use((err, req, res, next) => {
  if (err) {
    const context = errorHandler(err);
    logger.error(context.message);
    return res.render('pages/error/template.njk', addContext({ context }));
  }
  return next();
});

module.exports = router;
