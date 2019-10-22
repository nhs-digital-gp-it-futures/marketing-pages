import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createSectionPageContext } from './contextCreators/createSectionPageContext';
import { createMarketingDashboardContext } from './contextCreators/createMarketingDashboardContext';
import { createPreviewPageContext } from './contextCreators/createPreviewPageContext';
import { validateSectionData } from './helpers/validateSectionData';
import { findExistingMarketingDataForSection } from './helpers/findExistingMarketingDataForSection';

export const getMarketingPageDashboardContext = async (solutionId) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const { solution } = solutionData.data;

  const context = createMarketingDashboardContext(
    solutionId, dashboardManifest, solution.marketingData,
  );

  return context;
};

export const getSubDashboardPageContext = async (solutionId, sectionId) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest(sectionId);

  const sectionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const { sections } = sectionData.data;

  const context = createMarketingDashboardContext(
    solutionId, dashboardManifest, sections,
  );

  return context;
};

export const getSectionPageContext = async (solutionId, sectionId) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const formData = findExistingMarketingDataForSection(existingSolutionData, sectionManifest.id);

  const context = createSectionPageContext(solutionId, sectionManifest, formData);

  return context;
};

const convertToFormData = sectionData => ({
  data: {
    ...sectionData,
  },
});

export const getSectionPageErrorContext = async (
  solutionId, sectionId, sectionData, validationErrors,
) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const formData = convertToFormData(sectionData);
  const context = createSectionPageContext(solutionId, sectionManifest, formData, validationErrors);

  return context;
};

export const validateSection = (sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  return validateSectionData(sectionManifest, sectionData);
};

export const postSection = async (solutionId, sectionId, sectionData) => {
  await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`, sectionData);

  return true;
};

export const getPreviewPageContext = async (solutionId, previewValidationErrors) => {
  const previewManifest = new ManifestProvider().getPreviewManifest();
  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution;

  const context = createPreviewPageContext(
    solutionId, previewManifest, existingSolutionData, previewValidationErrors,
  );

  return context;
};

export const postPreview = async (solutionId) => {
  try {
    await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/SubmitForReview`, {});
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
