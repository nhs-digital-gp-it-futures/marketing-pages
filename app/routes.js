import express from 'express';
import { getMarketingPageDashboardContext, postSubmitForModeration } from './pages/dashboard/controller';
import { getSubDashboardPageContext } from './pages/dashboard/subDashboards/controller';
import { getSectionPageContext, getSectionPageErrorContext, postSection } from './pages/section/controller';
import { getPreviewPageContext } from './pages/preview/controller';
import logger from './logger';
import { errorHandler } from './pages/error/errorHandler';

const router = express.Router();

const withCatch = controller => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (err) {
    return next(err);
  }
};

router.get('/healthcheck', async (req, res) => {
  logger.info('navigating to healthcheck page');
  res.send('Marketing pages is Running!!!');
});

router.get('/solution/:solutionId', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard`);
  const context = await getMarketingPageDashboardContext({ solutionId });
  res.render('pages/dashboard/template', context);
}));

router.get('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, sectionId });
  res.render('pages/section/template', context);
}));

router.post('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  const sectionData = req.body;
  const response = await postSection({
    solutionId, sectionId, sectionData,
  });
  if (response.success) {
    return res.redirect(response.redirectUrl);
  }
  const context = await getSectionPageErrorContext({
    solutionId, sectionId, sectionData, validationErrors: response,
  });
  return res.render('pages/section/template', context);
}));

router.get('/solution/:solutionId/dashboard/:dashboardId', withCatch(async (req, res) => {
  const { solutionId, dashboardId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard: ${dashboardId}`);
  const context = await getSubDashboardPageContext({ solutionId, dashboardId });
  res.render('pages/dashboard/subDashboards/template', context);
}));

router.get('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: dashboard ${dashboardId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, dashboardId, sectionId });
  res.render('pages/section/template', context);
}));

router.post('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  const sectionData = req.body;
  const response = await postSection({
    solutionId, sectionId, sectionData, dashboardId,
  });
  if (response.success) {
    return res.redirect(response.redirectUrl);
  }
  const context = await getSectionPageErrorContext({
    solutionId, sectionId, sectionData, validationErrors: response, dashboardId,
  });
  return res.render('pages/section/template', context);
}));

router.get('/solution/:solutionId/preview', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} preview`);
  const context = await getPreviewPageContext({ solutionId });
  res.render('pages/preview/template', context);
}));

router.get('/solution/:solutionId/submitForModeration', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  const response = await postSubmitForModeration({ solutionId });
  if (response.success) {
    return res.redirect(`/solution/${solutionId}`);
  }
  const context = await getMarketingPageDashboardContext({
    solutionId, validationErrors: response,
  });
  return res.render('pages/dashboard/template', context);
}));

router.get('*', (req, res, next) => next({
  status: 404,
  message: 'Incorrect url - please check it is valid and try again',
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
