import { commonQuestionContext } from './commonQuestionContext';

describe('commonQuestionContext', () => {
  it('should create the common context for a question', () => {
    const expectedContext = {
      id: 'some-question-id',
      type: 'text-field',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      footerAdvice: 'some footer advice',
    };

    const questionManifest = {
      type: 'text-field',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      footerAdvice: 'some footer advice',
    };

    const context = commonQuestionContext({
      questionId: 'some-question-id', questionManifest,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for an inner question', () => {
    const expectedContext = {
      id: 'parentQuestionId[some-question-id]',
      type: 'text-field',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      footerAdvice: 'some footer advice',
    };

    const questionManifest = {
      type: 'text-field',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      footerAdvice: 'some footer advice',
    };

    const context = commonQuestionContext({
      questionId: 'some-question-id',
      questionManifest,
      parentQuestionId: 'parentQuestionId',
    });

    expect(context).toEqual(expectedContext);
  });
});
