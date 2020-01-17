import { ApiProvider } from '../../apiProvider';
import { createPreviewPageContext } from './createPreviewPageContext';

export const getPreviewPageContext = async ({ solutionId }) => {
  const previewDataRaw = await new ApiProvider().getPreviewData({ solutionId });

  if (previewDataRaw && previewDataRaw.data) {
    const previewData = previewDataRaw.data;
    const context = createPreviewPageContext({ previewData });
    return context;
  }
  throw new Error('No data returned');
};
