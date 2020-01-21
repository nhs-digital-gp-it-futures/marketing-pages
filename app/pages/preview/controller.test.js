import { getPreviewPageContext } from './controller';
import { ApiProvider } from '../../apiProvider';

jest.mock('../../apiProvider');

describe('preview controller', () => {
  const previewData = {
    data: {
      id: 'some-solution',
      sections: {
        'some-section': {
          answers: {},
        },
      },
    },
  };

  it('should return the context when preview data is returned by the ApiProvider', async () => {
    const expectedContext = {
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };

    ApiProvider.prototype.getPreviewData.mockResolvedValue(previewData);

    const context = await getPreviewPageContext({ solutionId: 'some-solution-id' });

    expect(context).toEqual(expectedContext);
  });

  it('should throw an error when no data is returned from the ApiProvider', async () => {
    ApiProvider.prototype.getPreviewData.mockResolvedValue({});

    try {
      await getPreviewPageContext({ solutionId: 'some-solution-id' });
    } catch (err) {
      expect(err).toEqual(new Error('No data returned'));
    }
  });
});
