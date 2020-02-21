import express from 'express';
import logger from './logger';
import { errorHandler } from './pages/error/errorHandler';
import supplierRoutes from './pages/supplier/routes';
import authorityRoutes from './pages/authority/routes';

const router = express.Router();

router.get('/healthcheck', async (req, res) => {
  logger.info('navigating to healthcheck page');
  res.send('Marketing pages is Running!!!');
});

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
    return res.render('pages/error/template.njk', context);
  }
  return next();
});

module.exports = router;
