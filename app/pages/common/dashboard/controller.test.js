import { getData, putData } from 'buying-catalogue-library';
import { getMarketingPageDashboardContext, postSubmitForModeration } from './controller';
import * as manifestProvider from '../../../manifestProvider';
import * as context from './createDashboardPageContext';
import { logger } from '../../../logger';
import { buyingCatalogueApiHost } from '../../../config';

jest.mock('buying-catalogue-library');
jest.mock('../../../manifestProvider', () => ({
  getDashboardManifest: jest.fn(),
}));
jest.mock('./createDashboardPageContext', () => ({
  createDashboardPageContext: jest.fn(),
}));

const dashboardManifest = {
  sectionGroups: {
    'some-section-group-id': {
      title: 'Some section group',
      sections: {
        'some-section-id': {
          title: 'Some section',
          type: 'section',
        },
      },
    },
  },
};

const dashboardData = {
  name: 'some solution name',
  'supplier-name': 'a supplier',
  sections: {
    'some-section-id': {
      status: 'INCOMPLETE',
      requirement: 'Mandatory',
    },
  },
};

describe('supplier - dashboard controller', () => {
  describe('getMarketingPageDashboardContext', () => {
    describe('userContextType not specified', () => {
      afterEach(() => {
        manifestProvider.getDashboardManifest.mockReset();
        getData.mockReset();
        context.createDashboardPageContext.mockReset();
      });

      it('should call getDashboardManifest with the correct params', async () => {
        manifestProvider.getDashboardManifest.mockReturnValueOnce(dashboardManifest);
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

        expect(manifestProvider.getDashboardManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getDashboardManifest).toHaveBeenCalledWith({ userContextType: 'supplier' });
      });

      it('should call getData with the correct params', async () => {
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

        expect(getData.mock.calls.length).toEqual(1);
        expect(getData).toHaveBeenCalledWith({
          endpoint: `${buyingCatalogueApiHost}/api/v1/Solutions/some-solution-id/dashboard`,
          logger,
        });
      });

      it('should call createDashboardPageContext with the correct params', async () => {
        manifestProvider.getDashboardManifest.mockReturnValueOnce(dashboardManifest);
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

        expect(context.createDashboardPageContext.mock.calls.length).toEqual(1);
        expect(context.createDashboardPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          solutionName: dashboardData.name,
          supplierName: dashboardData['supplier-name'],
          dashboardManifest,
          marketingDataSections: dashboardData.sections,
          validationErrors: undefined,
          userContextType: 'supplier',
        });
      });
    });

    describe('userContextType specified', () => {
      afterEach(() => {
        manifestProvider.getDashboardManifest.mockReset();
        getData.mockReset();
        context.createDashboardPageContext.mockReset();
      });

      it('should call getDashboardManifest with the correct params when userContextType is specified', async () => {
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });

        expect(manifestProvider.getDashboardManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getDashboardManifest).toHaveBeenCalledWith({ userContextType: 'anotherUserContextType' });
      });

      it('should call getData with the correct params', async () => {
        manifestProvider.getDashboardManifest.mockReturnValueOnce(dashboardManifest);
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });

        expect(getData.mock.calls.length).toEqual(1);
        expect(getData).toHaveBeenCalledWith({
          endpoint: `${buyingCatalogueApiHost}/api/v1/Solutions/some-solution-id/dashboard/authority`,
          logger,
        });
      });

      it('should call createDashboardPageContext with the correct params', async () => {
        manifestProvider.getDashboardManifest.mockReturnValueOnce(dashboardManifest);
        getData.mockResolvedValueOnce(dashboardData);

        await getMarketingPageDashboardContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });

        expect(context.createDashboardPageContext.mock.calls.length).toEqual(1);
        expect(context.createDashboardPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          solutionName: dashboardData.name,
          supplierName: dashboardData['supplier-name'],
          dashboardManifest,
          marketingDataSections: dashboardData.sections,
          validationErrors: undefined,
          userContextType: 'anotherUserContextType',
        });
      });
    });

    it('should return the context', async () => {
      const mockReturnData = { data: {} };
      const mockContext = { section: 'context' };
      getData.mockReturnValueOnce(mockReturnData);
      manifestProvider.getDashboardManifest.mockReturnValueOnce(dashboardManifest);
      context.createDashboardPageContext.mockReturnValueOnce(mockContext);

      const response = await getMarketingPageDashboardContext({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        userContextType: 'anotherUserContextType',
      });

      expect(response).toEqual(mockContext);
    });

    it('should throw an error when no data is returned from the ApiProvider', async () => {
      manifestProvider.getDashboardManifest.mockReturnValue(dashboardManifest);
      getData.mockResolvedValueOnce({});

      try {
        await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });

  describe('postSubmitForModeration', () => {
    afterEach(() => {
      putData.mockRestore();
    });

    it('should call putData with the correct params', async () => {
      putData.mockResolvedValueOnce(true);

      await postSubmitForModeration({ solutionId: 'some-solution-id' });

      expect(putData.mock.calls.length).toEqual(1);
      expect(putData).toHaveBeenCalledWith({
        endpoint: `${buyingCatalogueApiHost}/api/v1/Solutions/some-solution-id/SubmitForReview`,
        logger,
      });
    });

    it('should return success true if api call is successful', async () => {
      putData.mockResolvedValueOnce(true);

      const response = await postSubmitForModeration({ solutionId: 'some-solution-id' });
      expect(response).toEqual({ success: true });
    });

    it('should return the details of the error thrown by the ApiProvider', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'something important',
          },
        },
      };
      putData.mockRejectedValueOnce(errorResponse);

      const response = await postSubmitForModeration({ solutionId: 'some-solution-id' });
      expect(response).toEqual(errorResponse.response.data);
    });
  });
});
