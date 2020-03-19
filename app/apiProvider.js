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

  async putSubmitForModeration({ solutionId }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, {});

    return true;
  }
}
