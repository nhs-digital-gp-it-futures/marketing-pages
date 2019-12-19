import express from 'express';
import { getMarketingPageDashboardContext, postSubmitForModeration } from './dashboard/controller';
import { getSubDashboardPageContext } from './dashboard/subDashboards/controller';
import { getSectionPageContext, getSectionPageErrorContext, postSection } from './section/controller';
import { getPreviewPageContext } from './preview/controller';
import logger from './logger';
import { errorHandler } from './error/errorHandler';

const router = express.Router();

router.get('/healthcheck', async (req, res) => {
  logger.info('navigating to healthcheck page');

  res.send('Marketing pages is Running!!!');
});

router.get('/solution/:solutionId', async (req, res, next) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard`);
  try {
    const context = await getMarketingPageDashboardContext(solutionId);
    res.render('dashboard/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/section/:sectionId', async (req, res, next) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  try {
    const context = await getSectionPageContext({ solutionId, sectionId });
    res.render('section/template', context);
  } catch (err) {
    next(err);
  }
});

router.post('/solution/:solutionId/section/:sectionId', async (req, res, next) => {
  const { solutionId, sectionId } = req.params;
  const sectionPostData = req.body;
  try {
    const response = await postSection(solutionId, sectionId, sectionPostData);
    if (response.success) {
      res.redirect(response.redirectUrl);
    } else {
      const context = await getSectionPageErrorContext(
        solutionId, sectionId, sectionPostData, response,
      );
      res.render('section/template', context);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/dashboard/:dashboardId', async (req, res, next) => {
  const { solutionId, dashboardId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard: ${dashboardId}`);
  try {
    const context = await getSubDashboardPageContext(solutionId, dashboardId);
    res.render('dashboard/subDashboards/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', async (req, res, next) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: dashboard ${dashboardId}: section ${sectionId}`);
  try {
    const context = await getSectionPageContext({ solutionId, dashboardId, sectionId });
    res.render('section/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/preview', async (req, res, next) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} preview`);
  try {
    const context = await getPreviewPageContext(solutionId);
    res.render('preview/template', context);
  } catch (err) {
    next(err);
  }
});

router.get('/solution/:solutionId/submitForModeration', async (req, res, next) => {
  const { solutionId } = req.params;
  try {
    const response = await postSubmitForModeration(solutionId);
    if (response.success) {
      res.redirect(`/solution/${solutionId}`);
    } else {
      const context = await getMarketingPageDashboardContext(solutionId, response);
      res.render('dashboard/template', context);
    }
  } catch (err) {
    next(err);
  }
});

router.get('*', (req, res, next) => {
  next({
    status: 404,
    message: 'Incorrect url - please check it is valid and try again',
  });
});

router.use((err, req, res, next) => {
  if (err) {
    const context = errorHandler(err);
    logger.error(context.message);
    res.render('error/template.njk', context);
  } else {
    next();
  }
});

module.exports = router;
