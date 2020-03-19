import { getData } from '../../../apiProvider2';
import { createPreviewPageContext } from './createPreviewPageContext';

export const getPreviewPageContext = async ({ solutionId, userContextType }) => {
  const previewData = await getData({ endpointLocator: 'getPreviewData', options: { solutionId } });

  if (previewData) {
    const context = createPreviewPageContext({ previewData, userContextType });
    return context;
  }
  throw new Error('No data returned');
};
