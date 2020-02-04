import express from 'express';
import { getMarketingPageDashboardContext } from '../common/dashboard/controller';
import { getSectionPageContext, postSection, getSectionPageErrorContext } from '../common/section/controller';
import logger from '../../logger';
import { withCatch } from '../../common/helpers/routerHelper';

const router = express.Router();

router.get('/solution/:solutionId', withCatch(async (req, res) => {
  const { solutionId } = req.params;
  logger.info(`navigating to Solution ${solutionId} authority dashboard`);
  const context = await getMarketingPageDashboardContext({ solutionId, userContextType: 'authority' });
  res.render('pages/authority/dashboard/template', context);
}));

router.get('/solution/:solutionId/section/:sectionId', withCatch(async (req, res) => {
  const { solutionId, sectionId } = req.params;
  logger.info(`navigating to Solution ${solutionId}: section ${sectionId}`);
  const context = await getSectionPageContext({ solutionId, sectionId, userContextType: 'authority' });
  res.render('pages/common/section/template', context);
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
  return res.render('pages/common/section/template', context);
}));

module.exports = router;
