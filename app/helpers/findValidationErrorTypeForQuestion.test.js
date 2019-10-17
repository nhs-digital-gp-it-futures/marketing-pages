import { findValidationErrorTypeForQuestion } from './findValidationErrorTypeForQuestion';


describe('findValidationErrorTypeForQuestion', () => {
  it('should return undefined if there are no validationErrors', () => {
    const errorType = findValidationErrorTypeForQuestion('some-section-id', 'some-question-id', undefined);

    expect(errorType).toEqual(undefined);
  });

  it('should return undefined if the section is not found in the validationErrors', () => {
    const validationErrors = {
      'some-other-section-id': {},
    };

    const errorType = findValidationErrorTypeForQuestion('some-section-id', 'some-question-id', validationErrors);

    expect(errorType).toEqual(undefined);
  });

  it('should return undefined if the question is not found in the validationErrors', () => {
    const validationErrors = {
      'some-section-id': {
        someErrorType: ['some-other-question-id'],
      },
    };

    const errorType = findValidationErrorTypeForQuestion('some-section-id', 'some-question-id', validationErrors);

    expect(errorType).toEqual(undefined);
  });

  it('should return the found errorType if the question is found in the validationErrors', () => {
    const validationErrors = {
      'some-section-id': {
        someErrorType: ['some-question-id'],
      },
    };

    const errorType = findValidationErrorTypeForQuestion('some-section-id', 'some-question-id', validationErrors);

    expect(errorType).toEqual('someErrorType');
  });

  it('should return the first found errorType if multiple errors are found in the validationErrors', () => {
    const validationErrors = {
      'some-section-id': {
        someFirstErrorType: ['some-question-id'],
        someSecondErrorType: ['some-question-id'],
      },
    };

    const errorType = findValidationErrorTypeForQuestion('some-section-id', 'some-question-id', validationErrors);

    expect(errorType).toEqual('someFirstErrorType');
  });
});
