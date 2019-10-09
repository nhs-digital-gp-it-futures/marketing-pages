import express from 'express';
import {
  getMarketingPageDashboardContext,
  getSectionPageContext,
  getSectionPageErrorContext,
  validateSection,
  postSection,
} from './controller';

const router = express.Router();

router.get('/:solutionId', async (req, res) => {
  const { solutionId } = req.params;
  const context = await getMarketingPageDashboardContext(solutionId);

  res.render('dashboard-page', context);
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
  //const { solutionId } = req.params;

  res.render('preview-page', {});
});

module.exports = router;
