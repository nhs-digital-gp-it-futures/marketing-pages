import { ErrorContext } from 'buying-catalogue-library';

export const withCatch = route => async (req, res, next) => {
  try {
    return await route(req, res, next);
  } catch (err) {
    const newError = new ErrorContext({
      status: 500,
    });
    return next(newError);
  }
};
