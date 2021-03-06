import { getData } from 'buying-catalogue-library';
import { getSubDashboardPageContext } from './controller';
import * as manifestProvider from '../../../../manifestProvider';

jest.mock('buying-catalogue-library');
jest.mock('../../../../manifestProvider');
jest.mock('../../../../manifestProvider', () => ({
  getSubDashboardManifest: jest.fn(),
}));

describe('subDashboards controller', () => {
  const subDashboardManifest = {
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

  const subDashboardData = {
    sections: {
      'some-section-id': {
        status: 'INCOMPLETE',
        requirement: 'Mandatory',
      },
    },
  };

  it('should return the context when the manifest and data from the api is provided', async () => {
    const expectedContext = {
      previewUrl: 'some-solution-id/preview',
      submitForModerationUrl: '/supplier/solution/some-solution-id/submitForModeration',
      returnToDashboardUrl: '../',
      sectionGroups: [
        {
          id: 'some-section-group-id',
          title: 'Some section group',
          sections: [
            {
              URL: 'some-dashboard-id/section/some-section-id',
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

    manifestProvider.getSubDashboardManifest.mockReturnValue(subDashboardManifest);
    getData.mockResolvedValueOnce(subDashboardData);

    const context = await getSubDashboardPageContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });
    expect(context).toEqual(expectedContext);
  });

  it('should throw an error when no data is returned from the ApiProvider', async () => {
    manifestProvider.getSubDashboardManifest.mockReturnValue(subDashboardManifest);
    getData.mockResolvedValueOnce({});

    try {
      await getSubDashboardPageContext({ solutionId: 'some-solution-id', dashboardId: 'some-dashboard-id' });
    } catch (err) {
      expect(err).toEqual(new Error('No data returned'));
    }
  });
});
