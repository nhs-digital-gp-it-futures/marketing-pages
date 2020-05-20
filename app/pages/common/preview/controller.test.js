import { getData } from 'buying-catalogue-library';
import { getPreviewPageContext } from './controller';
import * as context from './createPreviewPageContext';
import { logger } from '../../../logger';
import { buyingCatalogueApiHost } from '../../../config';

jest.mock('buying-catalogue-library');
jest.mock('./createPreviewPageContext', () => ({
  createPreviewPageContext: jest.fn(),
}));

const previewData = {
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
};

describe('preview controller', () => {
  afterEach(() => {
    getData.mockReset();
    context.createPreviewPageContext.mockReset();
  });

  it('should call getData with the correct params', async () => {
    getData.mockResolvedValueOnce(previewData);

    await getPreviewPageContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

    expect(getData.mock.calls.length).toEqual(1);
    expect(getData).toHaveBeenCalledWith({
      endpoint: `${buyingCatalogueApiHost}/api/v1/Solutions/some-solution-id/preview`,
      logger,
    });
  });

  it('should call createPreviewPageContext with the correct params when preview data is returned by the ApiProvider', async () => {
    getData.mockResolvedValueOnce(previewData);

    await getPreviewPageContext({ solutionId: 'some-solution-id' });

    expect(context.createPreviewPageContext.mock.calls.length).toEqual(1);
    expect(context.createPreviewPageContext).toHaveBeenCalledWith({ previewData });
  });

  it('should return the context', async () => {
    const mockReturnData = { data: {} };
    const mockContext = { section: 'context' };
    getData.mockReturnValueOnce(mockReturnData);
    context.createPreviewPageContext.mockReturnValueOnce(mockContext);

    const response = await getPreviewPageContext({ solutionId: 'some-solution-id' });

    expect(response).toEqual(mockContext);
  });

  it('should throw an error when no data is returned from the ApiProvider', async () => {
    getData.mockResolvedValueOnce({});

    try {
      await getPreviewPageContext({ solutionId: 'some-solution-id' });
    } catch (err) {
      expect(err).toEqual(new Error('No data returned'));
      expect(context.createPreviewPageContext).not.toHaveBeenCalled();
    }
  });
});
