import { createPreviewPageContext } from './createPreviewPageContext';

describe('createPreviewPageContext', () => {
  describe('when there is no existing marketing data ', () => {
    it('when section is Mandatory and INCOMPLETE '
      + 'it should add the section to the context and any mandatory questions', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {},
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });

    it('when section is Optional and INCOMPLETE '
    + 'it should not add the section to the context', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {},
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: [],
            id: 'some-optional-section',
            data: {},
            requirement: 'Optional',
            status: 'INCOMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });

    it('when there are Mandatory and Optional sections that are INCOMPLETE '
    + 'it should only add the Mandatory section', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {},
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
          {
            mandatory: [],
            id: 'some-optional-section',
            data: {},
            requirement: 'Optional',
            status: 'INCOMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when there is existing marketing data ', () => {
    it('when section is Mandatory and INCOMPLETE '
    + 'it should add the section and any exisiting data to the context and add any mandatory questions', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
              },
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });

    it('when section is Mandatory and COMPLETE'
    + 'it should add the section and any exisiting data to the context', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
                data: 'some-mandatory-data',
              },
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {
              'some-mandatory-question': 'some-mandatory-data',
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Mandatory',
            status: 'COMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });

    it('when section is Optional and COMPLETE'
    + 'it should add the section and any exisiting data to the context', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-optional-section': {
            questions: {
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: [],
            id: 'some-optional-section',
            data: {
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Optional',
            status: 'COMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });

    it('when there are combination of Mandatory and optional sections that are COMPLETE and INCOMPLETE'
    + 'it should always add the Mandatory section and the COMPLETE optional section to the context', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
                data: 'some-mandatory-data',
              },
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
          'some-other-mandatory-section': {
            questions: {
              'some-other-mandatory-question': {
                display: true,
              },
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
          'some-optional-section': {
            questions: {
              'some-optional-question': {
                display: true,
                data: 'some-optional-data',
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {
              'some-mandatory-question': 'some-mandatory-data',
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Mandatory',
            status: 'COMPLETE',
          },
          {
            mandatory: ['some-other-mandatory-question'],
            id: 'some-other-mandatory-section',
            data: {
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
          {
            mandatory: [],
            id: 'some-optional-section',
            data: {
              'some-optional-question': 'some-optional-data',
            },
            requirement: 'Optional',
            status: 'COMPLETE',
          },
          {
            mandatory: [],
            id: 'some-other-optional-section',
            data: {},
            requirement: 'Optional',
            status: 'INCOMPLETE',
          },
        ],
      };

      const context = createPreviewPageContext('some-solution-id', existingMarketingData);

      expect(context).toEqual(expectedContext);
    });
  });

  describe('when previewValidationErrors are provided', () => {
    it('should create a context with the error message supplied for the question missing mandatory data', () => {
      const expectedContext = {
        submitPreviewUrl: '/some-solution-id/submitPreview',
        errors: [
          {
            text: 'some mandatory question is a required field',
            href: '#some-mandatory-question',
          },
        ],
        sections: {
          'some-mandatory-section': {
            questions: {
              'some-mandatory-question': {
                display: true,
                errorMessage: 'some mandatory question is a required field',
              },
            },
          },
        },
      };

      const existingMarketingData = {
        sections: [
          {
            mandatory: ['some-mandatory-question'],
            id: 'some-mandatory-section',
            data: {},
            requirement: 'Mandatory',
            status: 'INCOMPLETE',
          },
        ],
      };

      const previewValidationErrors = {
        'some-mandatory-section': {
          required: ['some-mandatory-question'],
        },
      };

      const errorManifest = {
        'some-mandatory-section': {
          'some-mandatory-question': {
            required: 'some mandatory question is a required field',
          },
        },
      };


      const context = createPreviewPageContext(
        'some-solution-id', existingMarketingData, previewValidationErrors, errorManifest,
      );

      expect(context).toEqual(expectedContext);
    });
  });
});
