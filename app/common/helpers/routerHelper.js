import { ErrorContext } from 'buying-catalogue-library';
import { getEndpoint } from '../../endpoints';

export const withCatch = (route) => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    const defaultError = new ErrorContext({ status: 500 });
    return next(defaultError);
  }
};

export const getHealthCheckDependencies = () => {
  const dependencies = [
    {
      name: 'Buying Catalogue API',
      endpoint: getEndpoint({ endpointLocator: 'getBuyingCatalogueApiHealth' }),
      critical: true,
    },
    {
      name: 'Document API',
      endpoint: getEndpoint({ endpointLocator: 'getDocumentApiHealth' }),
    },
  ];

  return dependencies;
};
