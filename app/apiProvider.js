import axios from 'axios';
import { apiHost } from './config';
import logger from './logger';

export class ApiProvider {
  constructor() {
    this.apiHost = apiHost;
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
}
