import express from 'express';
import {
  getMarketingPageDashboardContext,
  getSubDashboardPageContext,
  getSectionPageContext,
  getSectionPageErrorContext,
  validateSection,
  postSection,
  getPreviewPageContext,
  postPreview,
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

  const validationErrors = validateSection(sectionId, sectionPostData);

  if (validationErrors && validationErrors.length > 0) {
    const context = await getSectionPageErrorContext(
      solutionId, sectionId, sectionPostData, validationErrors,
    );

    res.render('section-page', context);
  } else {
    const response = await postSection(solutionId, sectionId, sectionPostData);

    res.redirect(`../../${solutionId}`);
  }
});

router.get('/:solutionId/preview', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getPreviewPageContext(solutionId);

  res.render('preview-page', context);
});

router.get('/:solutionId/submitPreview', async (req, res) => {
  const { solutionId } = req.params;
  const response = await postPreview(solutionId);

  if (response.success) {
    res.redirect(`/${solutionId}/preview`);
  } else {
    const context = await getPreviewPageContext(solutionId, response);

    res.render('preview-page', context);
  }
});

module.exports = router;
