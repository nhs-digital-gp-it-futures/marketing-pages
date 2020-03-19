import axios from 'axios';
import { buyingCatalogueApiHost, documentApiHost } from './config';
import { logger } from './logger';

export class ApiProvider {
  constructor() {
    this.buyingCatalogueApiHost = buyingCatalogueApiHost;
    this.documentApiHost = documentApiHost;
  }

  async putSubmitForModeration({ solutionId }) {
    const endpoint = `${this.buyingCatalogueApiHost}/api/v1/Solutions/${solutionId}/SubmitForReview`;
    logger.info(`api called: [PUT] ${endpoint}`);
    await axios.put(endpoint, {});

    return true;
  }
}
