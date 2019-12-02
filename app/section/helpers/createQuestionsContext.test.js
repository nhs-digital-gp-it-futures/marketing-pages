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
});
