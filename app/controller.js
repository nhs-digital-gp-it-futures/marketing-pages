import axios from 'axios';
import { ManifestProvider } from './forms/manifestProvider';
import { createSectionPageContext } from './contextCreators/createSectionPageContext';
import { createDashboardPageContext } from './contextCreators/createDashboardPageContext';
import { createPreviewPageContext } from './contextCreators/createPreviewPageContext';
import { createPreviewPageContextNew } from './contextCreators/createPreviewPageContextNew';
import { validateSectionData } from './helpers/validateSectionData';
import { transformSectionData } from './helpers/transformSectionData';
import { errorManifest } from './forms/error-manifest';

export const getMarketingPageDashboardContext = async (solutionId) => {
  const dashboardManifest = new ManifestProvider().getDashboardManifest();

  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const { solution } = solutionData.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, solution.marketingData.sections,
  );

  return context;
};

export const getSubDashboardPageContext = async (solutionId, sectionId) => {
  const dashboardManifest = new ManifestProvider().getSubDashboardManifest(sectionId);

  const sectionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const { sections } = sectionData.data;

  const context = createDashboardPageContext(
    solutionId, dashboardManifest, sections,
  );

  return context;
};

export const getSectionPageContext = async (solutionId, sectionId) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const sectionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`);
  const formData = sectionData.data;

  const context = createSectionPageContext(solutionId, sectionManifest, formData);

  return context;
};

export const getSectionPageErrorContext = async (
  solutionId, sectionId, sectionData, validationErrors,
) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);

  const context = createSectionPageContext(
    solutionId, sectionManifest, sectionData, validationErrors,
  );

  return context;
};

export const validateSection = (sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  return validateSectionData(sectionManifest, sectionData);
};

export const postSection = async (solutionId, sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  const transformedSectionData = transformSectionData(sectionId, sectionManifest, sectionData);

  await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`, transformedSectionData);

  return true;
};

export const getPreviewPageContext = async (solutionId, previewValidationErrors) => {
  // const previewManifest = new ManifestProvider().getPreviewManifest();
  const solutionData = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}`);
  const existingSolutionData = solutionData.data.solution.marketingData;

  // const context = createPreviewPageContext(
  //   solutionId, previewManifest, existingSolutionData, previewValidationErrors,
  // );

  const contextNew = createPreviewPageContextNew(solutionId, existingSolutionData, previewValidationErrors, errorManifest);

  return contextNew;
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
