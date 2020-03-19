import axios from 'axios';
import { logger } from './logger';
import { buyingCatalogueApiHost, documentApiHost } from './config';

const getHeaders = accessToken => (accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {});

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
  getDocument: options => `${documentApiHost}/api/v1/Solutions/${options.solutionId}/documents/${options.documentName}`,
  // PUT endpoints
  putSectionData: options => `${buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/sections/${options.sectionId}`,
  putSubmitForModeration: options => `${this.buyingCatalogueApiHost}/api/v1/Solutions/${options.solutionId}/SubmitForReview`,
};

export const getData = async ({ endpointLocator, options, accessToken }) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [GET] ${endpoint}`);

  const response = await axios.get(endpoint, getHeaders(accessToken));
  return response.data || null;
};

export const getDocument = (options) => {
  const endpoint = endpoints.getDocument(options);
  logger.info(`api called: [GET] ${endpoint}`);
  return axios.get(endpoint, { responseType: 'stream' });
};

export const putData = async ({ endpointLocator, options, body = {} }) => {
  const endpoint = endpoints[endpointLocator](options);
  logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(body)}`);
  axios.put(endpoint, body);
  return true;
};
