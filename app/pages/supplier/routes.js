import express from 'express';
import { getDocument } from 'buying-catalogue-library';
import { getMarketingPageDashboardContext, postSubmitForModeration } from '../common/dashboard/controller';
import { getSubDashboardPageContext } from './dashboard/subDashboards/controller';
import { getSectionPageContext, getSectionPageErrorContext, postSection } from '../common/section/controller';
import { logger } from '../../logger';
import { withCatch } from '../../common/helpers/routerHelper';
import { getPreviewPageContext } from '../common/preview/controller';
import includesContext from '../../includes/manifest.json';
import { getEndpoint } from '../../endpoints';

const router = express.Router();
const config = require('../../config');

const addContext = ({ context }) => ({
  ...context,
  ...includesContext,
  config,
});

router.get('/solution/:solutionId', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard`);
  const context = await getMarketingPageDashboardContext({ solutionId });
  res.render('pages/supplier/dashboard/template', addContext({ context }));
}));

router.get('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, sectionId });
  res.render('pages/common/section/template', addContext({ context }));
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
  return res.render('pages/common/section/template', addContext({ context }));
}));

router.get('/solution/:solutionId/dashboard/:dashboardId', withCatch(async (req, res) => {
  const { solutionId, dashboardId } = req.params;
  logger.info(`navigating to Solution ${solutionId} dashboard: ${dashboardId}`);
  const context = await getSubDashboardPageContext({ solutionId, dashboardId });
  res.render('pages/supplier/dashboard/subDashboards/template', addContext({ context }));
}));

router.get('/solution/:solutionId/dashboard/:dashboardId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, dashboardId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: dashboard ${dashboardId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, dashboardId, sectionId });
  res.render('pages/common/section/template', addContext({ context }));
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
  return res.render('pages/common/section/template', addContext({ context }));
}));

router.get('/solution/:solutionId/submitForModeration', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  const response = await postSubmitForModeration({ solutionId });
  if (response.success) {
    return res.redirect(`/supplier/solution/${solutionId}`);
  }
  const context = await getMarketingPageDashboardContext({
    solutionId, validationErrors: response,
  });
  return res.render('pages/supplier/dashboard/template', addContext({ context }));
}));

router.get('/solution/:solutionId/preview', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} preview`);
  const context = await getPreviewPageContext({ solutionId });
  res.render('pages/common/preview/template', addContext({ context }));
}));

router.get('/solution/:solutionId/document/:documentName', withCatch(async (req, res) => {
  const { solutionId, documentName } = req.params;
  logger.info(`downloading Solution ${solutionId} document ${documentName}`);
  const endpoint = getEndpoint({ endpointLocator: 'getDocument', options: { solutionId, documentName } });
  const response = await getDocument({ endpoint, logger });
  if (response.data) response.data.pipe(res);
}));

module.exports = router;
