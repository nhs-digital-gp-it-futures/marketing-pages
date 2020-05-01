import { ErrorContext, getData } from 'buying-catalogue-library';
import { createPreviewPageContext } from './createPreviewPageContext';
import { logger } from '../../../logger';
import { getEndpoint } from '../../../endpoints';

export const getPreviewPageContext = async ({ solutionId }) => {
  const endpoint = getEndpoint({ endpointLocator: 'getPreviewData', options: { solutionId } });
  const previewData = await getData({ endpoint, logger });

  if (previewData) {
    const context = createPreviewPageContext({ previewData });
    return context;
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};
