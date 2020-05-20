import { ErrorContext, getData, putData } from 'buying-catalogue-library';
import { getSectionManifest } from '../../../manifestProvider';
import { createSectionPageContext } from './createSectionPageContext';
import { transformSectionData } from './helpers/transformSectionData';
import { createPostSectionResponse } from './helpers/createPostSectionResponse';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getSectionPageContext = async ({
  solutionId, dashboardId, sectionId, userContextType = 'supplier',
}) => {
  const sectionManifest = getSectionManifest({
    dashboardId,
    sectionId,
    userContextType,
  });
  const endpoint = getEndpoint({ endpointLocator: 'getSectionData', options: { solutionId, sectionId } });
  const sectionData = await getData({ endpoint, logger });
  if (sectionData) {
    const formData = sectionData;
    const context = createSectionPageContext({
      solutionId, sectionManifest, formData, dashboardId, userContextType,
    });
    return context;
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};

export const getSectionPageErrorContext = async ({
  solutionId, sectionId, sectionData, validationErrors, dashboardId, userContextType = 'supplier',
}) => {
  const sectionManifest = getSectionManifest({
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
  const sectionManifest = getSectionManifest({
    dashboardId, sectionId, userContextType,
  });
  const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
  try {
    const endpoint = getEndpoint({ endpointLocator: 'putSectionData', options: { solutionId, sectionId } });
    await putData({ endpoint, body: transformedSectionData, logger });

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
