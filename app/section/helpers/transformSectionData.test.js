import { transformSectionData } from './transformSectionData';

describe('transformSectionData', () => {
  it('should return the sectionData provided as is if the question does not exist in the manifest', () => {
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

    const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

    expect(transformedSectionData).toEqual(sectionData);
  });

  it('should return the sectionData provided as is if the question does exist but there is no transform strategy for the question type', () => {
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

    const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

    expect(transformedSectionData).toEqual(sectionData);
  });

  describe('when a transformation stratergy does exist for the question', () => {
    it('should return the sectionData provided as is if the sectionData is an array of strings', () => {
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

      const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

      expect(transformedSectionData).toEqual(sectionData);
    });

    it('should return the transformed sectionData as an array string of one when the section data is just a string', () => {
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

      const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

      expect(transformedSectionData).toEqual(expectedTransformedSectionData);
    });

    it('should return the transformed sectionData of the question as an empty array', () => {
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

      const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

      expect(transformedSectionData).toEqual(expectedTransformedSectionData);
    });

    it('should return the transformed sectionData for a mixture of questions to transform', () => {
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

      const transformedSectionData = transformSectionData({ sectionManifest, sectionData });

      expect(transformedSectionData).toEqual(expectedTransformedSectionData);
    });
  });
});
