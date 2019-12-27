import { createContextForMultiQuestion } from './createContextForMultiQuestion';

describe('createContextForMultiQuestion', () => {
  it('should create a context for multi-question type question', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-parent-id',
        type: 'mult-question',
        mainAdvice: 'some main advice',
        additionalAdvice: 'some additional advice',
        questions: [
          {
            id: 'some-parent-id[inner-question-id-1]',
            type: 'text-field',
          },
          {
            id: 'some-parent-id[inner-question-id-2]',
            type: 'text-field',
          },
        ],
      },
    };

    const questionManifest = {
      type: 'mult-question',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      questions: {
        'inner-question-id-1': {
          type: 'text-field',
        },
        'inner-question-id-2': {
          type: 'text-field',
        },
      },
    };


    const context = createContextForMultiQuestion({
      questionId: 'some-parent-id', questionManifest,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for multi-question type question with data populated', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-parent-id',
        type: 'mult-question',
        mainAdvice: 'some main advice',
        additionalAdvice: 'some additional advice',
        questions: [
          {
            id: 'some-parent-id[inner-question-id-1]',
            type: 'text-field',
            data: 'data for inner question 1',
          },
          {
            id: 'some-parent-id[inner-question-id-2]',
            type: 'text-field',
            data: 'data for inner question 2',
          },
        ],
      },
    };

    const questionManifest = {
      type: 'mult-question',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      questions: {
        'inner-question-id-1': {
          type: 'text-field',
        },
        'inner-question-id-2': {
          type: 'text-field',
        },
      },
    };

    const formData = {
      'some-parent-id': {
        'inner-question-id-1': 'data for inner question 1',
        'inner-question-id-2': 'data for inner question 2',
      },
    };

    const context = createContextForMultiQuestion({
      questionId: 'some-parent-id', questionManifest, formData,
    });

    expect(context).toEqual(expectedContext);
  });
});
