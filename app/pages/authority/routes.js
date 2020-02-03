import express from 'express';
import { getAuthorityMarketingPageDashboardContext } from './dashboard/controller';
import logger from '../../logger';
import { withCatch } from '../../common/helpers/routerHelper';

const router = express.Router();

router.get('/solution/:solutionId', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} authority dashboard`);
  const context = await getAuthorityMarketingPageDashboardContext({ solutionId });
  res.render('pages/authority/dashboard/template', context);
}));

router.get('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, sectionId });
  res.render('pages/supplier/section/template', context);
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
  return res.render('pages/supplier/section/template', context);
}));

module.exports = router;
