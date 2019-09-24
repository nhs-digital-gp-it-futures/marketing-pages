import { createTaskPageErrorContext } from './createTaskPageErrorContext';

describe('createTaskPageErrorContext', () => {
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

    const taskData = {
      fieldId: [
        'Field A',
        'Field B is too big',
        'Field C',
      ],
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

    const context = createTaskPageErrorContext('some-solution-id', taskManifest, taskData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
