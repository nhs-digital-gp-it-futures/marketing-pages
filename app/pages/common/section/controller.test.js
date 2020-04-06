import { getSectionPageContext, getSectionPageErrorContext, postSection } from './controller';
import * as manifestProvider from '../../../manifestProvider';
import * as apiProvider from '../../../apiProvider';

jest.mock('../../../manifestProvider');
jest.mock('../../../logger');

jest.mock('../../../manifestProvider', () => ({
  getSectionManifest: jest.fn(),
  getSubDashboardManifest: jest.fn(),
}));
jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
  putData: jest.fn(),
}));

describe('section controller', () => {
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
    expandableAdvice: {
      title: 'Some expandable advice title.',
      description: [
        'Some first bit of expandable advice.',
        'Some second bit of expandable advice.',
        'Some third bit of expandable advice.',
      ],
    },
    submitText: 'some-submit-text',
  };

  const sectionData = {
    data: {},
  };


  describe('getSectionPageContext', () => {
    it('should return the context when the manifest and data from the api is provided', async () => {
      const expectedContext = {
        title: 'Some section title',
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
        expandableAdvice: {
          title: 'Some expandable advice title.',
          description: [
            'Some first bit of expandable advice.',
            'Some second bit of expandable advice.',
            'Some third bit of expandable advice.',
          ],
        },
        returnToDashboardUrl: '../',
        submitText: 'some-submit-text',
      };

      manifestProvider.getSectionManifest.mockReturnValue(sectionManifest);
      apiProvider.getData
        .mockResolvedValueOnce(sectionData);

      const context = await getSectionPageContext({ solutionId: 'some-solution-id' });

      expect(context).toEqual(expectedContext);
    });

    it('should throw an error when no data is returned from the ApiProvider', async () => {
      manifestProvider.getSubDashboardManifest.mockReturnValue(sectionManifest);
      apiProvider.getData
        .mockResolvedValueOnce({});

      try {
        await getSectionPageContext({ solutionId: 'some-solution-id' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
      }
    });
  });

  describe('getSectionPageErrorContext', () => {
    it('should return the context when the manifest is provided', async () => {
      const expectedContext = {
        title: 'Some section title',
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
        expandableAdvice: {
          title: 'Some expandable advice title.',
          description: [
            'Some first bit of expandable advice.',
            'Some second bit of expandable advice.',
            'Some third bit of expandable advice.',
          ],
        },
        returnToDashboardUrl: '../',
        submitText: 'some-submit-text',
      };

      manifestProvider.getSectionManifest.mockReturnValue(sectionManifest);
      apiProvider.getData
        .mockResolvedValueOnce(sectionData);

      const context = await getSectionPageErrorContext({ solutionId: 'some-solution-id' });

      expect(context).toEqual(expectedContext);
    });
  });

  describe('postSection', () => {
    it('should return the response indicating success and the redirectUrl', async () => {
      const expectedContext = {
        success: true,
        redirectUrl: '../',
      };


      manifestProvider.getSectionManifest.mockReturnValue(sectionManifest);
      apiProvider.putData
        .mockResolvedValueOnce(true);

      const context = await postSection({ solutionId: 'some-solution-id' });

      expect(context).toEqual(expectedContext);
    });

    it('should return the details of the error thrown by the ApiProvider with a status of 400', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: 'something important',
          },
        },
      };

      manifestProvider.getSectionManifest.mockReturnValue(sectionManifest);
      apiProvider.putData
        .mockRejectedValueOnce(errorResponse);

      const response = await postSection({ solutionId: 'some-solution-id' });
      expect(response).toEqual(errorResponse.response.data);
    });

    it('should throw the error thrown by the ApiProvider when the status is not 400', async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: {
            message: 'something important',
          },
        },
      };

      manifestProvider.getSectionManifest.mockReturnValue(sectionManifest);
      apiProvider.putData
        .mockRejectedValueOnce(errorResponse);

      try {
        await postSection({ solutionId: 'some-solution-id' });
      } catch (err) {
        expect(err).toEqual(errorResponse);
      }
    });
  });
});
