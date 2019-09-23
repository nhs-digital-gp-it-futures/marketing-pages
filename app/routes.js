import express from 'express';
import {
  getMarketingPageDashboardContext,
  getTaskPageContext,
  validateTask,
  postTask,
} from './controller';

const router = express.Router();

router.get('/:solutionId', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getMarketingPageDashboardContext(solutionId);

  res.render('dashboard-page', context);
});

router.get('/:solutionId/task/:taskId', async (req, res) => {
  const { solutionId, taskId } = req.params;
  const context = await getTaskPageContext(solutionId, taskId);

  res.render('task-page', context);
});

router.post('/:solutionId/task/:taskId', async (req, res) => {
  const { solutionId, taskId } = req.params;
  const taskPostData = req.body;

  const validationErrors = validateTask(taskId, taskPostData);

  if (validationErrors && validationErrors.length > 0) {
    const context = await getTaskPageContext(solutionId, taskId);

    res.render('task-page', context);
  } else {
    const response = await postTask(solutionId, taskId, taskPostData);

    res.redirect(`../../${solutionId}`);
  }
});

module.exports = router;
