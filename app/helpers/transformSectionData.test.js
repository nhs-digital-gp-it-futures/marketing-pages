import { transformSectionData } from './transformSectionData';

describe('transformSectionData', () => {
  it('should return the sectionData provided as is if no strategy for the section has been defined', () => {
    const sectionData = {
      'some-question-id': 'Some data',
    };

    const sectionManifest = {};

    const transformedSectionData = transformSectionData('some-section-id', sectionManifest, sectionData);

    expect(transformedSectionData).toEqual(sectionData);
  });

  it('should return the sectionData provided as is if no strategy for the question has been defined', () => {
    const sectionData = {
      'some-question-id': 'Some data',
    };

    const sectionManifest = {
      questions: [
        { id: 'some-question-id' },
        { id: 'some-other-question-id' },
      ],
    };

    const transformedSectionData = transformSectionData('client-application-types', sectionManifest, sectionData);

    expect(transformedSectionData).toEqual(sectionData);
  });

  describe('when a transformation stratergy does exist for the section and question', () => {
    const sectionManifest = {
      questions: [
        {
          id: 'client-application-types',
        },
      ],
    };

    it('should return the sectionData provided as is if the sectionData is an array of strings', () => {
      const sectionData = {
        'client-application-types': ['some first value', 'some second value'],
      };

      const transformedSectionData = transformSectionData('client-application-types', sectionManifest, sectionData);

      expect(transformedSectionData).toEqual(sectionData);
    });

    it('should return the transformed sectionData as an array string of one when the section data is just a string', () => {
      const expectedTransformedSectionData = {
        'client-application-types': ['some first value'],
      };

      const sectionData = {
        'client-application-types': 'some first value',
      };

      const transformedSectionData = transformSectionData('client-application-types', sectionManifest, sectionData);

      expect(transformedSectionData).toEqual(expectedTransformedSectionData);
    });

    it('should return the transformed sectionData of the question as an empty array', () => {
      const expectedTransformedSectionData = {
        'client-application-types': [],
      };

      const sectionData = {};

      const transformedSectionData = transformSectionData('client-application-types', sectionManifest, sectionData);

      expect(transformedSectionData).toEqual(expectedTransformedSectionData);
    });
  });
});
