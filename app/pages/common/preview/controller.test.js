import { getPreviewPageContext, getDocument } from './controller';
import { ApiProvider } from '../../../apiProvider';

jest.mock('../../../apiProvider');

describe('preview controller', () => {
  const previewData = {
    data: {
      id: '100000-001',
      name: 'Write on Time',
      supplierName: 'Really Kool Corporation',
      isFoundation: true,
      lastUpdated: '1996-03-15T10:00:00',
      sections: {
        'some-section': {
          answers: {},
        },
      },
    },
  };

  it('should return the context when preview data is returned by the ApiProvider', async () => {
    const expectedContext = {
      solutionHeader: {
        id: '100000-001',
        name: 'Write on Time',
        supplierName: 'Really Kool Corporation',
        isFoundation: true,
        lastUpdated: '1996-03-15T10:00:00',
      },
      returnToDashboardUrl: '/supplier/solution/100000-001',
      sections: {
        'some-section': {
          answers: {},
        },
      },
    };

    ApiProvider.prototype.getPreviewData.mockResolvedValue(previewData);

    const context = await getPreviewPageContext({ solutionId: '100000-001' });

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

  it('should return the document when a document is returned by the ApiProvider', async () => {
    const expectedDocument = 'Hello';

    ApiProvider.prototype.getDocument.mockResolvedValue(expectedDocument);

    const document = await getDocument({ solutionId: 'some-solution-id', documentName: 'some-document-name' });

    expect(document).toEqual(expectedDocument);
  });
});
