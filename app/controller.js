import axios from 'axios';
import { createPreviewPageContext } from './contextCreators/createPreviewPageContext';

export const getPreviewPageContext = async (solutionId) => {
  const previewDataRaw = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/preview`);
  const previewData = previewDataRaw.data;

  const context = createPreviewPageContext(previewData);

  return context;
};

export const postSubmitForModeration = async (solutionId) => {
  try {
    await axios.put(`http://localhost:8080/api/v1/Solutions/${solutionId}/SubmitForReview`, {});
    return {
      success: true,
    };
  } catch (error) {
    return error.response.data;
  }
};
