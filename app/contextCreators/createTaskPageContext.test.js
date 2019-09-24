import { createTaskPageContext } from './createTaskPageContext';

describe('createTaskPageContext', () => {
  it('should create a context from the task manifest', () => {
    const expectedContext = {
      title: 'Features',
      submitActionUrl: '/some-solution-id/task/features',
      questions: [
        {
          id: 'features-listing',
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const taskManifest = {
      id: 'features',
      title: 'Features',
      questions: [
        {
          id: 'features-listing',
          mainAdvice: 'Add up to 10 features that describe your Solution.',
          additionalAdvice: [
            'Each feature will be displayed as a bulleted list item. For example:',
            '- Create and change appointment entries',
            'You can enter up to 100 characters per feature',
          ],
        },
      ],
    };

    const context = createTaskPageContext('some-solution-id', taskManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/task/some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
            },
            {
              id: 'fieldId-2',
            },
            {
              id: 'fieldId-3',
            },
          ],
        },
      ],
    };

    const taskManifest = {
      id: 'some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
        },
      ],
    };

    const context = createTaskPageContext('some-solution-id', taskManifest);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/task/some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
              data: 'Field A',
            },
            {
              id: 'fieldId-2',
              data: 'Field B',
            },
            {
              id: 'fieldId-3',
              data: 'Field C',
            },
          ],
        },
      ],
    };

    const formData = {
      data: {
        fieldId: [
          'Field A',
          'Field B',
          'Field C',
        ],
      },
    };

    const taskManifest = {
      id: 'some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
        },
      ],
    };

    const context = createTaskPageContext('some-solution-id', taskManifest, formData);

    expect(context).toEqual(expectedContext);
  });

  it('should create a context for bulletpoint-list type question with existing data populated', () => {
    const expectedContext = {
      submitActionUrl: '/some-solution-id/task/some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          fields: [
            {
              id: 'fieldId-1',
              data: 'Field A',
            },
            {
              id: 'fieldId-2',
              data: 'Field B is too big',
              error: {
                message: 'some really helpful error message',
              },
            },
            {
              id: 'fieldId-3',
              data: 'Field C',
            },
          ],
        },
      ],
    };

    const formData = {
      data: {
        fieldId: [
          'Field A',
          'Field B is too big',
          'Field C',
        ],
      },
    };

    const validationErrors = [
      {
        questionId: 'fieldId',
        fieldId: 'fieldId-2',
        message: 'some really helpful error message',
      },
    ];

    const taskManifest = {
      id: 'some-task-id',
      questions: [
        {
          id: 'fieldId',
          type: 'bulletpoint-list',
          maxItems: 3,
          saveValidations: [
            {
              type: 'maxLength',
              maxLength: 10,
              message: 'some really helpful error message',
            },
          ],
        },
      ],
    };

    const context = createTaskPageContext('some-solution-id', taskManifest, formData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
