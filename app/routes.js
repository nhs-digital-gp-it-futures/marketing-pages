import express from 'express';
import {
  getMarketingPageDashboardContext,
} from './controller';

const router = express.Router();

router.get('/', async (req, res) => {
  const context = await getMarketingPageDashboardContext();

  res.render('index', context);
});

module.exports = router;
