import { ApiProvider } from '../../../apiProvider';
import { createPreviewPageContext } from './createPreviewPageContext';

export const getPreviewPageContext = async ({ solutionId, userContextType }) => {
  const previewDataRaw = await new ApiProvider().getPreviewData({ solutionId });

  if (previewDataRaw && previewDataRaw.data) {
    const previewData = previewDataRaw.data;
    const context = createPreviewPageContext({ previewData, userContextType });
    return context;
  }
  throw new Error('No data returned');
};

export const getDocument = async ({ solutionId, documentName }) => (
  new ApiProvider().getDocument({ solutionId, documentName })
);
