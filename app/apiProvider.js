import axios from 'axios';
import { apiHost, documentHost } from './config';
import logger from './logger';

export class ApiProvider {
  constructor() {
    this.apiHost = apiHost;
    this.documentHost = documentHost;
  }

  async getSectionData({ solutionId, sectionId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async putSectionData({ solutionId, sectionId, sectionData }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/sections/${sectionId}`;
    logger.info(`api called: [PUT] ${endpoint}: ${JSON.stringify(sectionData)}`);

    await axios.put(endpoint, sectionData);

    return true;
  }

  async getMainDashboardData({ solutionId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/dashboard`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async getAuthorityMainDashboardData({ solutionId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/dashboard/authority`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async getSubDashboardData({ solutionId, dashboardId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/dashboards/${dashboardId}`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async getPreviewData({ solutionId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/preview`;
    logger.info(`api called: [GET] ${endpoint}`);

    return axios.get(endpoint);
  }

  async putSubmitForModeration({ solutionId }) {
    const endpoint = `${this.apiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, {});

    return true;
  }

  async getDocument({ solutionId, documentName }) {
    const endpoint = `${this.documentHost}/api/v1/Solutions/${solutionId}/documents/${documentName}`;
    logger.info(`api called: [GET] ${endpoint}`);
    return axios.get(endpoint, { responseType: 'stream' });
  }
}
