import { transformSectionData } from './transformSectionData';

describe('transformSectionData', () => {
  it('should return the sectionData provided as is if the question does not exist in the manifest', async () => {
    const sectionData = {
      'some-question-id-1': 'Some data',
      'some-question-id-2': 'Some data',
    };

    const sectionManifest = {
      questions: {
        'some-other-question-id': {
        },
      },
    };

    const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });

    expect(transformedSectionData).toEqual(sectionData);
  });

  it('should return the sectionData provided as is if the question does exist but there is no transform strategy for the question type', async () => {
    const sectionData = {
      'some-question-id-1': 'Some data',
      'some-question-id-2': 'Some data',
    };

    const sectionManifest = {
      questions: {
        'some-question-id-1': {
          type: 'some-type',
        },
      },
    };

    const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });

    expect(transformedSectionData).toEqual(sectionData);
  });

  describe('when a transformation stratergy does exist for the question', () => {
    describe('checkbox-options', () => {
      it('should return the sectionData provided as is if the sectionData is an array of strings', async () => {
        const sectionData = {
          'some-question-id-1': ['some first value', 'some second value'],
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'checkbox-options',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual(sectionData);
      });

      it('should return the transformed sectionData as an array string of one when the section data is just a string', async () => {
        const expectedTransformedSectionData = {
          'some-question-id-1': ['some first value'],
        };
        const sectionData = {
          'some-question-id-1': 'some first value',
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'checkbox-options',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual(expectedTransformedSectionData);
      });

      it('should return the transformed sectionData of the question as an empty array', async () => {
        const expectedTransformedSectionData = {
          'some-question-id-1': [],
        };
        const sectionData = {};
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'checkbox-options',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual(expectedTransformedSectionData);
      });

      it('should return the transformed sectionData for a mixture of questions to transform', async () => {
        const expectedTransformedSectionData = {
          'some-question-id-1': [],
          'some-question-id-2': ['one-value'],
          'some-question-id-3': '',
          'some-question-id-4': ['first-value', 'second-value'],
          'some-question-id-5': 'some-simple-value',
        };
        const sectionData = {
          'some-question-id-2': 'one-value',
          'some-question-id-3': '',
          'some-question-id-4': ['first-value', 'second-value'],
          'some-question-id-5': 'some-simple-value',
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'checkbox-options',
            },
            'some-question-id-2': {
              type: 'checkbox-options',
            },
            'some-question-id-4': {
              type: 'checkbox-options',
            },
            'some-question-id-5': {
              type: 'text-field',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual(expectedTransformedSectionData);
      });
    });

    describe('radiobutton-options', () => {
      it('should return the sectionData provided if it is a string', async () => {
        const sectionData = {
          'some-question-id-1': 'some value',
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'radiobutton-options',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual(sectionData);
      });

      it('should return the sectionData provided as null if it is not provided', async () => {
        const sectionData = {
          'some-question-id-1': null,
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'radiobutton-options',
            },
          },
        };
        const transformedSectionData = await transformSectionData({
          sectionManifest, sectionData: {},
        });
        expect(transformedSectionData).toEqual(sectionData);
      });
    });

    describe('textarea-field', () => {
      it('should trim whitespace from the string', async () => {
        const sectionData = {
          'some-question-id-1': '    some value    ',
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'textarea-field',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual({ 'some-question-id-1': 'some value' });
      });
    });

    describe('text-field', () => {
      it('should trim whitespace from the string', async () => {
        const sectionData = {
          'some-question-id-1': '    some value    ',
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'text-field',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual({ 'some-question-id-1': 'some value' });
      });
    });

    describe('bulletpoint-list', () => {
      it('should trim whitespace from the string', async () => {
        const sectionData = {
          'some-question-id-1': ['    some value    ', ''],
        };
        const sectionManifest = {
          questions: {
            'some-question-id-1': {
              type: 'bulletpoint-list',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual({ 'some-question-id-1': ['some value', ''] });
      });
    });

    describe('textarea-field-no-count', () => {
      it('should transform capabilities csv to array of capabilities', async () => {
        const sectionData = {
          capabilities: 'SolutionID,Capability ID\r\n10000-001,C20\r\n10000-001,C17',
        };

        const sectionManifest = {
          questions: {
            capabilities: {
              type: 'textarea-field-no-count',
            },
          },
        };
        const transformedSectionData = await transformSectionData({ sectionManifest, sectionData });
        expect(transformedSectionData).toEqual({ capabilities: ['C20', 'C17'] });
      });
    });
  });
});
