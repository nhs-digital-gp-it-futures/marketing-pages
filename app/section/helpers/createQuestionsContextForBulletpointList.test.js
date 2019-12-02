import { createQuestionsContextForBulletpointList } from './createQuestionsContextForBulletpointList';

describe('when the question type is a bulletpoint-list', () => {
  it('should create a context for bulletpoint-list type question', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'bulletpoint-list',
        fields: [
          {
            id: 'some-question-id-1',
          },
          {
            id: 'some-question-id-2',
          },
          {
            id: 'some-question-id-3',
          },
        ],
      },
    };

    const questionManifest = {
      type: 'bulletpoint-list',
      maxItems: 3,
    };

    const context = createQuestionsContextForBulletpointList('some-question-id', questionManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated', () => {
    const expectedContext = {
      questionContext: {
        id: 'some-question-id',
        type: 'bulletpoint-list',
        fields: [
          {
            id: 'some-question-id-1',
            data: 'Field A',
          },
          {
            id: 'some-question-id-2',
            data: 'Field B',
          },
          {
            id: 'some-question-id-3',
            data: 'Field C',
          },
        ],
      },
    };

    const formData = {
      'some-question-id': [
        'Field A',
        'Field B',
        'Field C',
      ],
    };

    const questionManifest = {
      type: 'bulletpoint-list',
      maxItems: 3,
    };

    const context = createQuestionsContextForBulletpointList('some-question-id', questionManifest, formData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated and a validation error', () => {
    const expectedContext = {
      errorForQuestion: [
        {
          text: 'some really helpful error message',
          href: '#some-question-id-2',
        },
        {
          text: 'some really helpful error message',
          href: '#some-question-id-3',
        },
      ],
      questionContext: {
        id: 'some-question-id',
        type: 'bulletpoint-list',
        fields: [
          {
            id: 'some-question-id-1',
            data: 'Field A',
          },
          {
            id: 'some-question-id-2',
            data: 'Field B is too big',
            error: {
              message: 'some really helpful error message',
            },
          },
          {
            id: 'some-question-id-3',
            data: 'Field C is too big too',
            error: {
              message: 'some really helpful error message',
            },
          },
        ],
      },
    };

    const formData = {
      'some-question-id': [
        'Field A',
        'Field B is too big',
        'Field C is too big too',
      ],
    };

    const validationErrors = {
      maxLength: ['some-question-id-2', 'some-question-id-3'],
    };

    const questionManifest = {
      type: 'bulletpoint-list',
      maxItems: 3,
      errorResponse: {
        maxLength: 'some really helpful error message',
      },
    };

    const context = createQuestionsContextForBulletpointList('some-question-id', questionManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
