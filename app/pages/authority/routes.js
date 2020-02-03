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

module.exports = router;
