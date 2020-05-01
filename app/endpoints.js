import { buyingCatalogueApiHost, documentApiHost } from './config';

const endpoints = {
  // GET endpoints
  getBuyingCatalogueApiHealth: () => `${buyingCatalogueApiHost}/health/ready`,
  getDocumentApiHealth: () => `${documentApiHost}/health/ready`,
  getSectionData: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/sections/${options.sectionId}`,
  getMainDashboardData: options => (options.userContextType === 'supplier'
    ? `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/dashboard`
    : `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/dashboard/authority`),
  getSubDashboardData: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/dashboards/${options.dashboardId}`,
  getPreviewData: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/preview`,
  // GET Document endpoints
  getDocument: options => `${documentApiHost}/api/v1/Solutions/${options.solutionId}/documents/v${options.documentName}`,
  // PUT endpoints
  putSectionData: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/sections/${options.sectionId}`,
  putSubmitForModeration: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/SubmitForReview`,
};

export const getEndpoint = ({ endpointLocator, options }) => endpoints[endpointLocator](options);
