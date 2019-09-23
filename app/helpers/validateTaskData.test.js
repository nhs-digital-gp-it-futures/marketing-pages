import { validateTaskData } from './validateTaskData';


describe('validateTaskData', () => {
  describe('when the task contains just a single question', () => {
    it('return an empty array if there are no validation errors', () => {
      const taskManifest = {
        id: 'task-one',
        questions: [
          {
            id: 'question-one',
            type: 'bulletpoint-list',
            saveValidations: [
              {
                type: 'maxLength',
                maxLength: 10,
                message: 'some validation error message',
              },
            ],
          },
        ],
      };

      const taskData = {
        'question-one': ['all good'],
      };

      const validationErrors = validateTaskData(taskManifest, taskData);

      expect(validationErrors).toEqual([]);
    });

    it('return an array of 1 validation error', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          fieldId: 0,
        },
      ];

      const taskManifest = {
        id: 'task-one',
        questions: [
          {
            id: 'question-one',
            type: 'bulletpoint-list',
            saveValidations: [
              {
                type: 'maxLength',
                maxLength: 10,
                message: 'some validation error message',
              },
            ],
          },
        ],
      };

      const taskData = {
        'question-one': ['all good not anymore'],
      };

      const validationErrors = validateTaskData(taskManifest, taskData);

      expect(validationErrors).toEqual(expectedValidationError);
    });

    it('return an array of 2 validation errors', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          fieldId: 0,
        },
        {
          questionId: 'question-one',
          fieldId: 1,
        },
      ];

      const taskManifest = {
        id: 'task-one',
        questions: [
          {
            id: 'question-one',
            type: 'bulletpoint-list',
            saveValidations: [
              {
                type: 'maxLength',
                maxLength: 10,
                message: 'some validation error message',
              },
            ],
          },
        ],
      };

      const taskData = {
        'question-one': ['all good not anymore', 'and this one not good too'],
      };

      const validationErrors = validateTaskData(taskManifest, taskData);

      expect(validationErrors).toEqual(expectedValidationError);
    });
  });
});
