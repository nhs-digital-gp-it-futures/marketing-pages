import axios from 'axios';
import { ManifestProvider } from '../manifestProvider';
import { createSectionPageContext } from './createSectionPageContext';
import { transformSectionData } from './helpers/transformSectionData';
import { createPostSectionResponse } from './helpers/createPostSectionResponse';
import { apiHost } from '../config';
import logger from '../logger';

export const getSectionPageContext = async (solutionId, sectionId) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  const endpoint = `${apiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`;
  logger.info(`api called: [GET] ${endpoint}`);
  const sectionData = await axios.get(endpoint);
  if (sectionData && sectionData) {
    const formData = sectionData.data;
    const context = createSectionPageContext(solutionId, sectionManifest, formData);
    return context;
  }
  throw new Error('No data returned');
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

export const postSection = async (solutionId, sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  const transformedSectionData = transformSectionData(sectionId, sectionManifest, sectionData);
  try {
    const endpoint = `${apiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, transformedSectionData);

    const response = createPostSectionResponse(solutionId, sectionManifest);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
