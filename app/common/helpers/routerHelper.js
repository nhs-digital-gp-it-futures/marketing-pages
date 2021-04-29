import { ErrorContext } from 'buying-catalogue-library';
import { getEndpoint } from '../../endpoints';

export const withCatch = (logger, route) => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    if (err instanceof ErrorContext) {
      return next(err);
    }

    logger.error(`Unexpected Error:\n${err.stack}`);

    const responseData = err.response ? err.response.data : undefined;
    const defaultError = new ErrorContext({
      status: 500,
      stackTrace: err.stack,
      data: responseData,
    });

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
