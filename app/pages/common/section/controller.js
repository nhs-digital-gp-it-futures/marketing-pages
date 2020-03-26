import { ManifestProvider } from '../../../manifestProvider';
import { getData, putData } from '../../../apiProvider';
import { createSectionPageContext } from './createSectionPageContext';
import { transformSectionData } from './helpers/transformSectionData';
import { createPostSectionResponse } from './helpers/createPostSectionResponse';
import { logger } from '../../../logger';

export const getSectionPageContext = async ({
  solutionId, dashboardId, sectionId, userContextType = 'supplier',
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({
    dashboardId,
    sectionId,
    userContextType,
  });

  const sectionData = await getData({ endpointLocator: 'getSectionData', options: { solutionId, sectionId } });
  if (sectionData) {
    const formData = sectionData;
    const context = createSectionPageContext({
      solutionId, sectionManifest, formData, dashboardId, userContextType,
    });
    return context;
  }
  throw new Error('No data returned');
};

export const getSectionPageErrorContext = async ({
  solutionId, sectionId, sectionData, validationErrors, dashboardId, userContextType = 'supplier',
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({
    dashboardId, sectionId, userContextType,
  });

  const context = createSectionPageContext({
    solutionId,
    sectionManifest,
    formData: sectionData,
    validationErrors,
    dashboardId,
    userContextType,
  });

  return context;
};

export const postSection = async ({
  solutionId, sectionId, sectionData, dashboardId, userContextType = 'supplier',
}) => {
  const sectionManifest = new ManifestProvider().getSectionManifest({
    dashboardId, sectionId, userContextType,
  });
  const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
  try {
    await putData({ endpointLocator: 'putSectionData', options: { solutionId, sectionId }, body: transformedSectionData });

    const response = createPostSectionResponse({ solutionId, sectionManifest, userContextType });
    return response;
  } catch (err) {
    if (err.response.status === 400) {
      return err.response.data;
    }

    logger.error(err.response.data);
    throw err;
  }
};
