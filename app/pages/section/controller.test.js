import { getSectionPageContext } from './controller';
import { ManifestProvider } from '../../manifestProvider';
import { ApiProvider } from '../../apiProvider';

jest.mock('../../manifestProvider');
jest.mock('../../apiProvider');

describe('section controller', () => {
  describe('getSectionPageContext', () => {
    const sectionManifest = {
      id: 'some-section-id',
      title: 'Some section title',
      mainAdvice: 'Some main advice.',
      additionalAdvice: [
        'Some first bit of additional advice.',
        'Some second bit of additional advice.',
        'Some third bit of additional advice.',
      ],
      questions: {
        'some-question-id': {},
      },
      submitText: 'some-submit-text',
    };

    const sectionData = {
      data: {},
    };

    it('should return the context when the manifest and data from the api is provided', async () => {
      const expectedContext = {
        title: 'Some section title',
        submitActionUrl: '/solution/some-solution-id/section/some-section-id',
        mainAdvice: 'Some main advice.',
        additionalAdvice: [
          'Some first bit of additional advice.',
          'Some second bit of additional advice.',
          'Some third bit of additional advice.',
        ],
        questions: [
          {
            id: 'some-question-id',
          },
        ],
        returnToDashboardUrl: '/solution/some-solution-id',
        submitText: 'some-submit-text',
      };

      ManifestProvider.prototype.getSectionManifest.mockReturnValue(sectionManifest);
      ApiProvider.prototype.getSectionData.mockResolvedValue(sectionData);

      const context = await getSectionPageContext({ solutionId: 'some-solution-id' });

      expect(context).toEqual(expectedContext);
    });

    it('should throw an error when no data is returned from the ApiProvider', async () => {
      ManifestProvider.prototype.getSubDashboardManifest.mockReturnValue(sectionManifest);
      ApiProvider.prototype.getSubDashboardData.mockResolvedValue({});

      try {
        await getSectionPageContext({ solutionId: 'some-solution-id' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });
});
