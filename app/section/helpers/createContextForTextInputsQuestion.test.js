import { createContextForTextInputsQuestion } from './createContextForTextInputsQuestion';

describe('createContextForTextInputsQuestion', () => {
  it('should create a context for question', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'textarea-field',
        rows: 10,
      },
    };

    const questionManifest = {
      type: 'textarea-field',
      rows: 10,
    };

    const context = createContextForTextInputsQuestion({
      questionId:'some-question-id', questionManifest,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question with existing data populated', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'textarea-field',
        rows: 10,
        data: 'some existing data',
      },
    };

    const formData = {
      'some-question-id': 'some existing data',
    };

    const questionManifest = {
      type: 'textarea-field',
      rows: 10,
    };

    const context = createContextForTextInputsQuestion({
      questionId: 'some-question-id', questionManifest, formData,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with existing data populated and a validation error', () => {
    const expectedContext = {
      errorForQuestion: {
        text: 'some really helpful error message',
        href: '#some-question-id',
      },
      questionContext: {
        id: 'some-question-id',
        type: 'textarea-field',
        rows: 10,
        data: 'some existing data',
        error: {
          message: 'some really helpful error message',
        },
      },
    };

    const formData = {
      'some-question-id': 'some existing data',
    };

    const validationErrors = {
      'some-question-id': 'required',
    };

    const questionManifest = {
      type: 'textarea-field',
      rows: 10,
      errorResponse: {
        required: 'some really helpful error message',
      },
    };

    const context = createContextForTextInputsQuestion({
      questionId: 'some-question-id', questionManifest, formData, validationErrors,
    });

    expect(context).toEqual(expectedContext);
  });
});
