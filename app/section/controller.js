import axios from 'axios';
import { ManifestProvider } from '../forms/manifestProvider';
import { createSectionPageContext } from './createSectionPageContext';
import { transformSectionData } from './transformSectionData';
import { createPostSectionResponse } from './createPostSectionResponse';

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

export const postSection = async (solutionId, sectionId, sectionData) => {
  const sectionManifest = new ManifestProvider().getSectionManifest(sectionId);
  const transformedSectionData = transformSectionData(sectionId, sectionManifest, sectionData);
  try {
    await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/sections/${sectionId}`, transformedSectionData);

    const response = createPostSectionResponse(solutionId, sectionManifest);
    return response;
  } catch (error) {
    return error.response.data;
  }
};