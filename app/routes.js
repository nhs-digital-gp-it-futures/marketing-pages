import express from 'express';
import {
  getMarketingPageDashboardContext,
} from './controller';

const router = express.Router();

router.get('/:solutionId', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getMarketingPageDashboardContext(solutionId);

  res.render('index', context);
});

module.exports = router;
