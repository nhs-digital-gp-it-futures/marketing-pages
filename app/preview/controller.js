import axios from 'axios';
import { createPreviewPageContext } from './createPreviewPageContext';
import { apiHost } from '../config';

export const getPreviewPageContext = async (solutionId) => {
  const previewDataRaw = await axios.get(`${apiHost}/api/v1/Solutions/${solutionId}/preview`);
  const previewData = previewDataRaw.data;

  const context = createPreviewPageContext(previewData);

  return context;
};
