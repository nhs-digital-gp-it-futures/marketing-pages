import { createQuestionsContext } from './createQuestionsContext';

describe('createQuestionsContext', () => {
  it('should create a context for question type bulletpoint-list', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'some-question-id-1',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'bulletpoint-list',
          maxItems: 1,
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type checkbox-options', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'checkbox-options',
          options: [
            {
              text: 'option 1',
              value: 'option 1',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'checkbox-options',
          options: {
            'option 1': 'option 1',
          },
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type radiobutton-options', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'radiobutton-options',
          options: [
            {
              text: 'option 1',
              value: 'option 1',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'radiobutton-options',
          options: {
            'option 1': 'option 1',
          },
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type combobox-options', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'combobox-options',
          options: [
            {
              text: 'option 1',
              value: 'option 1',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'combobox-options',
          options: {
            'option 1': 'option 1',
          },
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type textarea-field', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'textarea-field',
          rows: 10,
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'textarea-field',
          rows: 10,
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type text-field', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'text-field',
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'text-field',
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for question type multi-question', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'multi-question',
          questions: [
            {
              id: 'some-question-id[some-inner-question]',
              type: 'text-field',
            },
          ],
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'multi-question',
          questions: {
            'some-inner-question': {
              type: 'text-field',
            },
          },
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for multiple questions', () => {
    const expectedContext = {
      questions: [
        {
          id: 'some-question-id',
          type: 'text-field',
        },
        {
          id: 'some-other-question-id',
          type: 'text-field',
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'text-field',
        },
        'some-other-question-id': {
          type: 'text-field',
        },
      },
    };

    const context = createQuestionsContext(sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for a single question with a single error', () => {
    const expectedContext = {
      errors: [
        {
          text: 'some really helpful error message',
          href: '#some-question-id',
        },
      ],
      questions: [
        {
          id: 'some-question-id',
          type: 'text-field',
          data: 'some existing data',
          error: {
            message: 'some really helpful error message',
          },
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'text-field',
          errorResponse: {
            maxLength: 'some really helpful error message',
          },
        },
      },
    };

    const formData = {
      'some-question-id': 'some existing data',
    };

    const validationErrors = {
      maxLength: ['some-question-id'],
    };

    const context = createQuestionsContext(sectionManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for a multiple question with a multiple error', () => {
    const expectedContext = {
      errors: [
        {
          text: 'some really helpful error message',
          href: '#some-question-id',
        },
        {
          text: 'some other really helpful error message',
          href: '#some-other-question-id',
        },
      ],
      questions: [
        {
          id: 'some-question-id',
          type: 'text-field',
          data: 'some existing data',
          error: {
            message: 'some really helpful error message',
          },
        },
        {
          id: 'some-other-question-id',
          type: 'checkbox-options',
          options: [
            {
              text: 'option 1',
              value: 'option 1',
            },
          ],
          error: {
            message: 'some other really helpful error message',
          },
        },
      ],
    };

    const sectionManifest = {
      questions: {
        'some-question-id': {
          type: 'text-field',
          errorResponse: {
            maxLength: 'some really helpful error message',
          },
        },
        'some-other-question-id': {
          type: 'checkbox-options',
          options: {
            'option 1': 'option 1',
          },
          errorResponse: {
            required: 'some other really helpful error message',
          },
        },
      },
    };

    const formData = {
      'some-question-id': 'some existing data',
    };

    const validationErrors = {
      maxLength: ['some-question-id'],
      required: ['some-other-question-id'],
    };

    const context = createQuestionsContext(sectionManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
