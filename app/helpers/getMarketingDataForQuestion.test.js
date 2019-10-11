import { getMarketingDataForQuestion } from './getMarketingDataForQuestion';

describe('getMarketingDataForQuestion', () => {
  it('should return undefined if the question does not exist in the existing solution data', () => {
    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-section-id',
            data: {
              'some-question-id': 'some question data',
            },
          },
        ],
      },
    };

    const marketingData = getMarketingDataForQuestion(existingSolutionData, 'some-section-id', 'some-other-question-id');
    expect(marketingData).toEqual(undefined);
  });

  it('should return the question data if it does exist', () => {
    const existingSolutionData = {
      marketingData: {
        sections: [
          {
            id: 'some-section-id',
            data: {
              'some-question-id': 'some question data',
            },
          },
        ],
      },
    };

    const marketingData = getMarketingDataForQuestion(existingSolutionData, 'some-section-id', 'some-question-id');
    expect(marketingData).toEqual('some question data');
  });

  describe('when question type is bulletpoint-list', () => {
    it('should return the question data with empty values filtered out', () => {
      const expectedMarketingData = ['some first data', 'some second data'];

      const existingSolutionData = {
        marketingData: {
          sections: [
            {
              id: 'some-section-id',
              data: {
                'some-question-id': ['', 'some first data', 'some second data', ''],
              },
            },
          ],
        },
      };

      const marketingData = getMarketingDataForQuestion(existingSolutionData, 'some-section-id', 'some-question-id', 'bulletpoint-list');
      expect(marketingData).toEqual(expectedMarketingData);
    });

    it('should return undefined if all values for bullet point list are empty', () => {
      const existingSolutionData = {
        marketingData: {
          sections: [
            {
              id: 'some-section-id',
              data: {
                'some-question-id': ['', '', '', ''],
              },
            },
          ],
        },
      };

      const marketingData = getMarketingDataForQuestion(existingSolutionData, 'some-section-id', 'some-question-id', 'bulletpoint-list');
      expect(marketingData).toEqual(undefined);
    });
  });
});
