import express from 'express';
import { getDocument } from 'buying-catalogue-library';
import { getMarketingPageDashboardContext } from '../common/dashboard/controller';
import { getSectionPageContext, postSection, getSectionPageErrorContext } from '../common/section/controller';
import { logger } from '../../logger';
import { getEndpoint } from '../../endpoints';
import { withCatch } from '../../common/helpers/routerHelper';
import { getPreviewPageContext } from '../common/preview/controller';
import includesContext from '../../includes/manifest.json';

const router = express.Router();
const userContextType = 'authority';
const config = require('../../config');

const addContext = ({ context }) => ({
  ...context,
  ...includesContext,
  config,
});

router.get('/solution/:solutionId', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} authority dashboard`);
  const context = await getMarketingPageDashboardContext({ solutionId, userContextType: 'authority' });
  res.render('pages/authority/dashboard/template', addContext({ context }));
}));

router.get('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, sectionId, userContextType: 'authority' });
  res.render('pages/common/section/template', addContext({ context }));
}));

router.post('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  const sectionData = req.body;
  const response = await postSection({
    solutionId, sectionId, sectionData, userContextType: 'authority',
  });
  if (response.success) {
    return res.redirect(response.redirectUrl);
  }
  const context = await getSectionPageErrorContext({
    solutionId, sectionId, sectionData, validationErrors: response, userContextType: 'authority',
  });
  return res.render('pages/common/section/template', addContext({ context }));
}));

router.get('/solution/:solutionId/preview', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} preview`);
  const context = await getPreviewPageContext({ solutionId, userContextType });
  res.render('pages/common/preview/template', addContext({ context }));
}));

router.get('/solution/:solutionId/document/:documentName', async (req, res) => {
  const { solutionId, documentName } = req.params;
  logger.info(`downloading Solution ${solutionId} document ${documentName}`);
  const endpoint = getEndpoint({ endpointLocator: 'getDocument', options: { solutionId, documentName } });
  const response = await getDocument({ endpoint, logger });
  response.data.pipe(res);
});

module.exports = router;
