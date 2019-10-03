import { validateSectionData } from './validateSectionData';


describe('validateSectionData', () => {
  describe('when the section just contains question of type bulletpoint-list', () => {
    it('return an empty array if there are no validation requirments for the question', () => {
      const sectionManifest = {
        id: 'section-one',
        questions: [
          {
            id: 'question-one',
            type: 'bulletpoint-list',
          },
        ],
      };

      const sectionData = {
        'question-one': ['all good regardless'],
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual([]);
    });

    it('return an empty array if there are no validation errors', () => {
      const sectionManifest = {
        id: 'section-one',
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

      const sectionData = {
        'question-one': ['all good'],
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual([]);
    });

    it('return an array of 1 validation error', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          fieldId: 'question-one-1',
          message: 'some validation error message',
        },
      ];

      const sectionManifest = {
        id: 'section-one',
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

      const sectionData = {
        'question-one': ['all good not anymore'],
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual(expectedValidationError);
    });

    it('return an array of 2 validation errors', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          fieldId: 'question-one-1',
          message: 'some validation error message',
        },
        {
          questionId: 'question-one',
          fieldId: 'question-one-2',
          message: 'some validation error message',
        },
      ];

      const sectionManifest = {
        id: 'section-one',
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

      const sectionData = {
        'question-one': ['all good not anymore', 'and this one not good too'],
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual(expectedValidationError);
    });

    it('return an array of 1 validation errors when only 1 field does not meet validation requirements', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          fieldId: 'question-one-2',
          message: 'some validation error message',
        },
      ];

      const sectionManifest = {
        id: 'section-one',
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

      const sectionData = {
        'question-one': ['all good', 'this one not good'],
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual(expectedValidationError);
    });
  });

  describe('when the section just contains question of type not bulletpoint-list', () => {
    it('return an array of 1 validation error', () => {
      const expectedValidationError = [
        {
          questionId: 'question-one',
          message: 'some validation error message',
        },
      ];

      const sectionManifest = {
        id: 'section-one',
        questions: [
          {
            id: 'question-one',
            type: 'text-field',
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

      const sectionData = {
        'question-one': 'too many letters',
      };

      const validationErrors = validateSectionData(sectionManifest, sectionData);

      expect(validationErrors).toEqual(expectedValidationError);
    });
  });
});
