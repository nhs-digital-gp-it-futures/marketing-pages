import { getMarketingPageDashboardContext, postSubmitForModeration } from './controller';
import { ManifestProvider } from '../../../manifestProvider';
import { ApiProvider } from '../../../apiProvider';

jest.mock('../../../manifestProvider');
jest.mock('../../../apiProvider');

describe('supplier - dashboard controller', () => {
  describe('getMarketingPageDashboardContext', () => {
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
      data: {
        name: 'some solution name',
        sections: {
          'some-section-id': {
            status: 'INCOMPLETE',
            requirement: 'Mandatory',
          },
        },
      },
    };

    it('should return the context when the manifest and data from the api is provided', async () => {
      const expectedContext = {
        name: 'some solution name',
        previewUrl: '/supplier/solution/some-solution-id/preview',
        submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
        returnToDashboardUrl: '/supplier/solution/some-solution-id',
        sectionGroups: [
          {
            id: 'some-section-group-id',
            title: 'Some section group',
            sections: [
              {
                URL: '/supplier/solution/some-solution-id/section/some-section-id',
                id: 'some-section-id',
                title: 'Some section',
                requirement: 'Mandatory',
                status: 'INCOMPLETE',
                isActive: true,
              },
            ],
          },
        ],
      };

      ManifestProvider.prototype.getDashboardManifest.mockReturnValue(dashboardManifest);
      ApiProvider.prototype.getMainDashboardData.mockResolvedValue(dashboardData);

      const context = await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });

      expect(context).toEqual(expectedContext);
    });

    it('should throw an error when no data is returned from the ApiProvider', async () => {
      ManifestProvider.prototype.getDashboardManifest.mockReturnValue(dashboardManifest);
      ApiProvider.prototype.getMainDashboardData.mockResolvedValue({});

      try {
        await getMarketingPageDashboardContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });

  describe('postSubmitForModeration', () => {
    it('should return a response indicating the submit for moderation was successful', async () => {
      const expectedResponse = {
        success: true,
      };

      ApiProvider.prototype.putSubmitForModeration.mockResolvedValue(true);

      const response = await postSubmitForModeration({ solutionId: 'some-solution-id' });

      expect(response).toEqual(expectedResponse);
    });

    it('should return the details of the error thrown by the ApiProvider', async () => {
      const errorResponse = {
        response: {
          data: {
            message: 'something important',
          },
        },
      };

      ApiProvider.prototype.putSubmitForModeration.mockImplementation(
        () => Promise.reject(errorResponse),
      );

      const response = await postSubmitForModeration({ solutionId: 'some-solution-id' });
      expect(response).toEqual(errorResponse.response.data);
    });
  });
});
