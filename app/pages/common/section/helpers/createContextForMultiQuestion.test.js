import { createContextForMultiQuestion } from './createContextForMultiQuestion';

describe('createContextForMultiQuestion', () => {
  it('should create a context for multi-question type question', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-parent-id',
        type: 'multi-question',
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
      type: 'multi-question',
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
        type: 'multi-question',
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
      type: 'multi-question',
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

  it('should create a context for multi-question with existing data populated and a validation error', () => {
    const expectedContext = {
      errorForQuestion: [
        {
          href: '#some-parent-id[inner-question-id-1]',
          text: 'some really helpful error message',
        },
        {
          href: '#some-parent-id[inner-question-id-2]',
          text: 'some really helpful error message',
        },
      ],
      questionContext: {
        id: 'some-parent-id',
        type: 'multi-question',
        mainAdvice: 'some main advice',
        additionalAdvice: 'some additional advice',
        questions: [
          {
            id: 'some-parent-id[inner-question-id-1]',
            type: 'text-field',
            data: 'data for inner question 1',
            error: {
              message: 'some really helpful error message',
            },
          },
          {
            id: 'some-parent-id[inner-question-id-2]',
            type: 'text-field',
            data: 'data for inner question 2',
            error: {
              message: 'some really helpful error message',
            },
          },
        ],
      },
    };

    const questionManifest = {
      type: 'multi-question',
      mainAdvice: 'some main advice',
      additionalAdvice: 'some additional advice',
      questions: {
        'inner-question-id-1': {
          type: 'text-field',
          errorResponse: {
            maxLength: 'some really helpful error message',
          },
        },
        'inner-question-id-2': {
          type: 'text-field',
          errorResponse: {
            maxLength: 'some really helpful error message',
          },
        },
      },
    };

    const formData = {
      'some-parent-id': {
        'inner-question-id-1': 'data for inner question 1',
        'inner-question-id-2': 'data for inner question 2',
      },
    };

    const validationErrors = {
      'some-parent-id': {
        'inner-question-id-1': 'maxLength',
        'inner-question-id-2': 'maxLength',
      },
    };

    const context = createContextForMultiQuestion({
      questionId: 'some-parent-id', questionManifest, formData, validationErrors,
    });

    expect(context).toEqual(expectedContext);
  });
});
