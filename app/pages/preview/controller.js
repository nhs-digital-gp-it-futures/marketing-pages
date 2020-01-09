import axios from 'axios';
import { createPreviewPageContext } from './createPreviewPageContext';
import { apiHost } from '../../config';
import logger from '../../logger';

export const getPreviewPageContext = async ({ solutionId }) => {
  const endpoint = `${apiHost}/api/v1/Solutions/${solutionId}/preview`;
  logger.info(`api called: [GET] ${endpoint}`);
  const previewDataRaw = await axios.get(endpoint);
  if (previewDataRaw && previewDataRaw.data) {
    const previewData = previewDataRaw.data;
    const context = createPreviewPageContext({ previewData });
    return context;
  }
  throw new Error('No data returned');
};
