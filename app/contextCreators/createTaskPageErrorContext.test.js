import { createTaskPageErrorContext } from './createTaskPageErrorContext';

describe('createTaskPageErrorContext', () => {
  it.skip('should create a context for bulletpoint-list type question with existing data populated', () => {
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

    const taskData = {};

    const validationErrors = {};

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

    const context = createTaskPageErrorContext('some-solution-id', taskManifest, taskData, validationErrors);

    expect(context).toEqual(expectedContext);
  });
});
