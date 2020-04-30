import { ErrorContext } from 'buying-catalogue-library';
import { getData } from '../../../apiProvider';
import { createPreviewPageContext } from './createPreviewPageContext';

export const getPreviewPageContext = async ({ solutionId }) => {
  const previewData = await getData({ endpointLocator: 'getPreviewData', options: { solutionId } });

  if (previewData) {
    const context = createPreviewPageContext({ previewData });
    return context;
  }
  throw new ErrorContext({
    status: 404,
    description: 'No data returned',
  });
};
