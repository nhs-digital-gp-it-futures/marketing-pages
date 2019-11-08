import { createSectionPageContext } from './createSectionPageContext';

describe('createSectionPageContext', () => {
  it('should create a context from the section manifest', () => {
    const expectedContext = {
      title: 'Features',
      submitActionUrl: '/some-solution-id/section/features',
      mainAdvice: 'Add up to 10 features that describe your Solution.',
      additionalAdvice: [
        'Each feature will be displayed as a bulleted list item. For example:',
        '- Create and change appointment entries',
        'You can enter up to 100 characters per feature',
      ],
      questions: [
        {
          id: 'features-listing',
        },
      ],
      returnToDashboardUrl: '/some-solution-id',
      submitText: 'some-submit-text',
    };

    const sectionManifest = {
      id: 'features',
      title: 'Features',
      mainAdvice: 'Add up to 10 features that describe your Solution.',
      additionalAdvice: [
        'Each feature will be displayed as a bulleted list item. For example:',
        '- Create and change appointment entries',
        'You can enter up to 100 characters per feature',
      ],
      questions: {
        'features-listing': {},
      },
      submitText: 'some-submit-text',
    };

    const context = createSectionPageContext('some-solution-id', sectionManifest);

    expect(context).toEqual(expectedContext);
  });

  describe('when the question type is a bulletpoint-list', () => {
    it('should create a context for bulletpoint-list type question', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
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
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'bulletpoint-list',
            maxItems: 3,
          },
        },
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context for bulletpoint-list type question with existing data populated', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
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
        returnToDashboardUrl: '/some-solution-id',
      };

      const formData = {
        fieldId: [
          'Field A',
          'Field B',
          'Field C',
        ],
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'bulletpoint-list',
            maxItems: 3,
          },
        },
      };

      const optionsManifest = {};

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context for bulletpoint-list type question with existing data populated and a validation error', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        errors: [
          {
            text: 'some really helpful error message',
            href: '#fieldId-2',
          },
          {
            text: 'some really helpful error message',
            href: '#fieldId-3',
          },
          {
            text: 'some other really helpful error message',
            href: '#someField',
          },
        ],
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
                data: 'Field C is too big too',
                error: {
                  message: 'some really helpful error message',
                },
              },
            ],
          },
          {
            id: 'someField',
            type: 'text-field',
            data: 'man some field is massive',
            error: {
              message: 'some other really helpful error message',
            },
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const formData = {
        fieldId: [
          'Field A',
          'Field B is too big',
          'Field C is too big too',
        ],
        someField: 'man some field is massive',
      };

      const validationErrors = {
        maxLength: ['fieldId-2', 'fieldId-3', 'someField'],
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'bulletpoint-list',
            maxItems: 3,
            errorResponse: {
              maxLength: 'some really helpful error message',
            },
          },
          someField: {
            type: 'text-field',
            errorResponse: {
              maxLength: 'some other really helpful error message',
            },
          },
        },
      };

      const optionsManifest = {};

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData, validationErrors);

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when the question type is a checkbox-options', () => {
    it('should create a context for checkbox-options type question', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        questions: [
          {
            id: 'fieldId',
            type: 'checkbox-options',
            options: [
              {
                text: 'option 1',
                value: 'option-1',
              },
              {
                text: 'option 2',
                value: 'option-2',
              },
              {
                text: 'option 3',
                value: 'option-3',
              },
            ],
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'checkbox-options',
          },
        },
      };

      const optionsManifest = {
        fieldId: {
          options: {
            'option-1': 'option 1',
            'option-2': 'option 2',
            'option-3': 'option 3',
          },
        },
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context for checkbox-options type question with existing data populated', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        questions: [
          {
            id: 'fieldId',
            type: 'checkbox-options',
            options: [
              {
                text: 'option 1',
                value: 'option-1',
                checked: true,
              },
              {
                text: 'option 2',
                value: 'option-2',
              },
              {
                text: 'option 3',
                value: 'option-3',
                checked: true,
              },
            ],
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'checkbox-options',
          },
        },
      };

      const formData = {
        fieldId: [
          'option-1',
          'option-3',
        ],
      };

      const optionsManifest = {
        fieldId: {
          options: {
            'option-1': 'option 1',
            'option-2': 'option 2',
            'option-3': 'option 3',
          },
        },
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with validation errors', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        errors: [
          {
            text: 'some really helpful error message',
            href: '#fieldId',
          },
        ],
        questions: [
          {
            id: 'fieldId',
            type: 'checkbox-options',
            options: [
              {
                text: 'option 1',
                value: 'option-1',
              },
              {
                text: 'option 2',
                value: 'option-2',
              },
              {
                text: 'option 3',
                value: 'option-3',
              },
            ],
            error: {
              message: 'some really helpful error message',
            },
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'checkbox-options',
            errorResponse: {
              required: 'some really helpful error message',
            },
          },
        },
      };

      const optionsManifest = {
        fieldId: {
          options: {
            'option-1': 'option 1',
            'option-2': 'option 2',
            'option-3': 'option 3',
          },
        },
      };

      const formData = {};

      const validationErrors = {
        required: ['fieldId'],
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData, validationErrors);

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when the question type is a radiobutton-options', () => {
    it('should create a context for radiobutton-options type question', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        questions: [
          {
            id: 'fieldId',
            type: 'radiobutton-options',
            options: [
              {
                text: 'option 1',
                value: 'option-1',
              },
              {
                text: 'option 2',
                value: 'option-2',
              },
              {
                text: 'option 3',
                value: 'option-3',
              },
            ],
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'radiobutton-options',
          },
        },
      };

      const optionsManifest = {
        fieldId: {
          options: {
            'option-1': 'option 1',
            'option-2': 'option 2',
            'option-3': 'option 3',
          },
        },
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context for radiobutton-options type question with existing data populated', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        questions: [
          {
            id: 'fieldId',
            type: 'radiobutton-options',
            options: [
              {
                text: 'option 1',
                value: 'option-1',
                checked: true,
              },
              {
                text: 'option 2',
                value: 'option-2',
              },
              {
                text: 'option 3',
                value: 'option-3',
              },
            ],
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'radiobutton-options',
          },
        },
      };

      const formData = {
        fieldId: 'option-1',
      };

      const optionsManifest = {
        fieldId: {
          options: {
            'option-1': 'option 1',
            'option-2': 'option 2',
            'option-3': 'option 3',
          },
        },
      };

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData);

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when the question type is not a bulletpoint-list', () => {
    it('should create a context for question with existing data populated', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        questions: [
          {
            id: 'fieldId',
            type: 'textarea-field',
            rows: 10,
            data: 'some existing data',
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const formData = {
        fieldId: 'some existing data',
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'textarea-field',
            rows: 10,
          },
        },
      };

      const optionsManifest = {};

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData);

      expect(context).toEqual(expectedContext);
    });

    it('should create a context with existing data populated and a validation error', () => {
      const expectedContext = {
        submitActionUrl: '/some-solution-id/section/some-section-id',
        errors: [
          {
            text: 'some really helpful error message',
            href: '#fieldId',
          },
        ],
        questions: [
          {
            id: 'fieldId',
            type: 'textarea-field',
            data: 'some existing data',
            error: {
              message: 'some really helpful error message',
            },
          },
        ],
        returnToDashboardUrl: '/some-solution-id',
      };

      const formData = {
        fieldId: 'some existing data',
      };

      const validationErrors = {
        required: ['fieldId'],
      };

      const sectionManifest = {
        id: 'some-section-id',
        questions: {
          fieldId: {
            type: 'textarea-field',
            errorResponse: {
              required: 'some really helpful error message',
            },
          },
        },
      };

      const optionsManifest = {};

      const context = createSectionPageContext('some-solution-id', sectionManifest, optionsManifest, formData, validationErrors);

      expect(context).toEqual(expectedContext);
    });
  });
});
