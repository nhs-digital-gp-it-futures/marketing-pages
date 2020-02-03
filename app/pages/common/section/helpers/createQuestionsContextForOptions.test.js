import { createQuestionsContextForOptions } from './createQuestionsContextForOptions';

describe('when the question type is of type checkbox-options or radiobutton-options', () => {
  it('should create a context for options type question', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'checkbox-options',
        options: [
          {
            text: 'option 1',
            value: 'option 1',
          },
          {
            text: 'option 2',
            value: 'option 2',
          },
          {
            text: 'option 3',
            value: 'option 3',
          },
        ],
      },
    };

    const questionManifest = {
      type: 'checkbox-options',
      options: {
        'option 1': 'option 1',
        'option 2': 'option 2',
        'option 3': 'option 3',
      },
    };

    const context = createQuestionsContextForOptions({
      questionId: 'some-question-id', questionManifest,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for options type question with existing data populated', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'checkbox-options',
        options: [
          {
            text: 'option 1',
            value: 'option 1',
            checked: true,
          },
          {
            text: 'option 2',
            value: 'option 2',
          },
          {
            text: 'option 3',
            value: 'option 3',
            checked: true,
          },
        ],
      },
    };

    const questionManifest = {
      type: 'checkbox-options',
      options: {
        'option 1': 'option 1',
        'option 2': 'option 2',
        'option 3': 'option 3',
      },
    };

    const formData = {
      'some-question-id': [
        'option 1',
        'option 3',
      ],
    };

    const context = createQuestionsContextForOptions({
      questionId: 'some-question-id', questionManifest, formData,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for combobox-options type question with existing data populated', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'combobox-options',
        options: [
          {
            text: 'option 1',
            value: 'option 1',
            selected: true,
          },
          {
            text: 'option 2',
            value: 'option 2',
          },
          {
            text: 'option 3',
            value: 'option 3',
          },
        ],
      },
    };

    const questionManifest = {
      type: 'combobox-options',
      options: {
        'option 1': 'option 1',
        'option 2': 'option 2',
        'option 3': 'option 3',
      },
    };

    const formData = {
      'some-question-id': [
        'option 1',
      ],
    };

    const context = createQuestionsContextForOptions({
      questionId: 'some-question-id', questionManifest, formData,
    });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context with validation errors', () => {
    const expectedContext = {
      errorForQuestion: {
        text: 'some really helpful error message',
        href: '#some-question-id',
      },
      questionContext: {
        id: 'some-question-id',
        type: 'checkbox-options',
        options: [
          {
            text: 'option 1',
            value: 'option 1',
          },
          {
            text: 'option 2',
            value: 'option 2',
          },
          {
            text: 'option 3',
            value: 'option 3',
          },
        ],
        error: {
          message: 'some really helpful error message',
        },
      },
    };

    const questionManifest = {
      type: 'checkbox-options',
      options: {
        'option 1': 'option 1',
        'option 2': 'option 2',
        'option 3': 'option 3',
      },
      errorResponse: {
        required: 'some really helpful error message',
      },
    };

    const formData = {};

    const validationErrors = {
      'some-question-id': 'required',
    };

    const context = createQuestionsContextForOptions({
      questionId: 'some-question-id', questionManifest, formData, validationErrors,
    });

    expect(context).toEqual(expectedContext);
  });
});
