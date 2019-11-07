import express from 'express';
import {
  getMarketingPageDashboardContext,
  getSubDashboardPageContext,
  getSectionPageContext,
  getSectionPageErrorContext,
  postSection,
  getPreviewPageContext,
  postSubmitForModeration,
} from './controller';

const router = express.Router();

router.get('/:solutionId', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getMarketingPageDashboardContext(solutionId);

  res.render('dashboard-page', context);
});

router.get('/:solutionId/dashboard/:sectionId', async (req, res) => {
  const { solutionId, sectionId } = req.params;
  const context = await getSubDashboardPageContext(solutionId, sectionId);

  res.render('sub-dashboard-page', context);
});


router.get('/:solutionId/section/:sectionId', async (req, res) => {
  const { solutionId, sectionId } = req.params;
  const context = await getSectionPageContext(solutionId, sectionId);

  res.render('section-page', context);
});

router.post('/:solutionId/section/:sectionId', async (req, res) => {
  const { solutionId, sectionId } = req.params;
  const sectionPostData = req.body;

  const response = await postSection(solutionId, sectionId, sectionPostData);

  if (response.success) {
    res.redirect(response.redirectUrl);
  } else {
    const context = await getSectionPageErrorContext(
      solutionId, sectionId, sectionPostData, response,
    );

    res.render('section-page', context);
  }
});

router.get('/:solutionId/preview', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getPreviewPageContext(solutionId);

  res.render('preview-page', context);
});

router.get('/:solutionId/submitForModeration', async (req, res) => {
  const { solutionId } = req.params;
  const response = await postSubmitForModeration(solutionId);

  if (response.success) {
    res.redirect(`/${solutionId}`);
  } else {
    const context = await getMarketingPageDashboardContext(solutionId, response);

    res.render('dashboard-page', context);
  }
});

module.exports = router;
