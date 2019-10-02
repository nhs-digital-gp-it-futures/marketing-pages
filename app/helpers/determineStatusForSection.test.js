import { determineStatusForSection, doesQuestionHaveData } from './determineStatusForSection';

describe('doesQuestionHaveData', () => {
  describe('question type is bulletpoint-list', () => {
    it('should return true if first value in the array contains some data', () => {
      const question = {
        id: 'some-question',
        type: 'bulletpoint-list',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-question': [
          'some data',
          '',
          '',
        ],
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(true);
    });

    it('should return true if array contains some data but the first value is empty', () => {
      const question = {
        id: 'some-question',
        type: 'bulletpoint-list',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-question': [
          '',
          'some data',
          '',
        ],
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(true);
    });

    it('should return false if all the values in the array is empty', () => {
      const question = {
        id: 'some-question',
        type: 'bulletpoint-list',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-question': [
          '',
          '',
          '',
        ],
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(false);
    });

    it('should return false if no data exists for the question', () => {
      const question = {
        id: 'some-question',
        type: 'bulletpoint-list',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-other-question': [
          'some data',
          '',
          '',
        ],
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(false);
    });
  });

  describe('question type is not a bulletpoint-list', () => {
    it('should return true if the question does contain some data', () => {
      const question = {
        id: 'some-question',
        type: 'text-field',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-question': 'some data',
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(true);
    });

    it('should return false if the question does not contain some data', () => {
      const question = {
        id: 'some-question',
        type: 'text-field',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-question': '',
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(false);
    });

    it('should return false if no data exists for the question', () => {
      const question = {
        id: 'some-question',
        type: 'text-field',
        requirement: 'Optional',
      };

      const sectionData = {
        'some-other-question': 'some data',
      };

      const hasData = doesQuestionHaveData(question, sectionData);

      expect(hasData).toEqual(false);
    });
  });
});

describe('determineStatusForSection', () => {
  describe('when section contains all optional questions', () => {
    it('should return INCOMPLETE if just one optional question and no data has been provided', () => {
      const sectionData = {
        'some-question': '',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-question',
            type: 'text-field',
            requirement: 'Optional',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('INCOMPLETE');
    });

    it('should return COMPLETE if just one optional question of type bulletpoint-list and data has been provided', () => {
      const sectionData = {
        'some-question': 'some data',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-question',
            type: 'text-field',
            requirement: 'Optional',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('COMPLETE');
    });

    it('should return INCOMPLETE if multiple optional questions and no data has been provided', () => {
      const sectionData = {
        'some-question': '',
        'some-other-question': '',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-question',
            type: 'text-field',
            requirement: 'Optional',
          },
          {
            id: 'some-other-question',
            type: 'text-field',
            requirement: 'Optional',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('INCOMPLETE');
    });

    it('should return COMPLETE if multiple optional questions and data has been provided for at least one', () => {
      const sectionData = {
        'some-question': '',
        'some-other-question': 'some data',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-question',
            type: 'text-field',
            requirement: 'Optional',
          },
          {
            id: 'some-other-question',
            type: 'text-field',
            requirement: 'Optional',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('COMPLETE');
    });
  });

  describe('when section contains a mandatory question', () => {
    it('should return COMPLETE if all the mandatory questions have been provided with data', () => {
      const sectionData = {
        'some-mandatory-question': 'some data',
        'some-other-mandatory-question': 'some data',
        'some-optional-question': '',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-mandatory-question',
            type: 'text-field',
            requirement: 'Mandatory',
          },
          {
            id: 'some-other-mandatory-question',
            type: 'text-field',
            requirement: 'Mandatory',
          },
          {
            id: 'some-optional-question',
            type: 'text-field',
            requirement: 'Optional',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('COMPLETE');
    });

    it('should return INCOMPLETE if one of the mandatory questions has no data provided', () => {
      const sectionData = {
        'some-mandatory-question': 'some data',
        'some-other-mandatory-question': '',
      };

      const sectionManifest = {
        id: 'some-section',
        title: 'Some Section',
        questions: [
          {
            id: 'some-mandatory-question',
            type: 'text-field',
            requirement: 'Mandatory',
          },
          {
            id: 'some-other-mandatory-question',
            type: 'text-field',
            requirement: 'Mandatory',
          },
        ],
      };

      const status = determineStatusForSection(sectionManifest, sectionData);

      expect(status).toEqual('INCOMPLETE');
    });
  });
});
