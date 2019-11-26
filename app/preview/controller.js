import axios from 'axios';
import { createPreviewPageContext } from './createPreviewPageContext';

export const getPreviewPageContext = async (solutionId) => {
  const previewDataRaw = await axios.get(`http://localhost:8080/api/v1/Solutions/${solutionId}/preview`);
  const previewData = previewDataRaw.data;

  const context = createPreviewPageContext(previewData);

  return context;
};
