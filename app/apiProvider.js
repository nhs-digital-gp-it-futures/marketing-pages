import axios from 'axios';
import { buyingCatalogueApiHost, documentApiHost } from './config';
import { logger } from './logger';

export class ApiProvider {
  constructor() {
    this.buyingCatalogueApiHost = buyingCatalogueApiHost;
    this.documentApiHost = documentApiHost;
  }

  async putSectionData({ solutionId, sectionId, sectionData }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`;
    logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(sectionData)}`);

    await axios.put(endpoint, sectionData);

    return true;
  }

  async getSubDashboardData({ solutionId, dashboardId }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/dashboards/${dashboardId}`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async getPreviewData({ solutionId }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/preview`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async putSubmitForModeration({ solutionId }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, {});

    return true;
  }

  async getDocument({ solutionId, documentName }) {
    const endpoint = `${this.documentApiHost}/api/v1/Solutions/${solutionId}/documents/${documentName}`;
    logger.info(`api called: [GET] ${endpoint}`);
    return axios.get(endpoint, { responseType: 'stream' });
  }
}
