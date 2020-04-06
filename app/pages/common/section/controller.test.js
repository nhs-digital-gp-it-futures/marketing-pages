import { getSectionPageContext, getSectionPageErrorContext, postSection } from './controller';
import * as manifestProvider from '../../../manifestProvider';
import * as apiProvider from '../../../apiProvider';
import * as context from './createSectionPageContext';
import * as transform from './helpers/transformSectionData';
import * as postResponse from './helpers/createPostSectionResponse';

jest.mock('../../../logger');

jest.mock('../../../manifestProvider', () => ({
  getSectionManifest: jest.fn(),
  getSubDashboardManifest: jest.fn(),
}));
jest.mock('../../../apiProvider', () => ({
  getData: jest.fn(),
  putData: jest.fn(),
}));
jest.mock('./createSectionPageContext', () => ({
  createSectionPageContext: jest.fn(),
}));
jest.mock('./helpers/transformSectionData', () => ({
  transformSectionData: jest.fn(),
}));
jest.mock('./helpers/createPostSectionResponse', () => ({
  createPostSectionResponse: jest.fn(),
}));


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

const mockContext = { section: 'context' };

const mockSectionData = { summary: 'a long summary' };

const mockValidationErrors = { summary: 'maxLength' };

describe('section controller', () => {
  describe('getSectionPageContext', () => {
    afterEach(() => {
      manifestProvider.getSectionManifest.mockReset();
      apiProvider.getData.mockReset();
    });

    describe('userContextType not supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        apiProvider.getData.mockReset();
        context.createSectionPageContext.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        apiProvider.getData.mockReturnValueOnce({ data: {} });

        await getSectionPageContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          userContextType: 'supplier',
        });
      });

      it('should call createSectionPageContext with the correct params', async () => {
        const mockReturnData = { data: {} };
        apiProvider.getData.mockReturnValueOnce(mockReturnData);
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);

        await getSectionPageContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
        });

        expect(context.createSectionPageContext.mock.calls.length).toEqual(1);
        expect(context.createSectionPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          formData: mockReturnData,
          dashboardId: 'some-dashboard-id',
          userContextType: 'supplier',
        });
      });
    });

    describe('userContextType supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        apiProvider.getData.mockReset();
        context.createSectionPageContext.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        apiProvider.getData.mockReturnValueOnce({ data: {} });

        await getSectionPageContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          userContextType: 'anotherUserContextType',
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          userContextType: 'anotherUserContextType',
        });
      });

      it('should call createSectionPageContext with the correct params', async () => {
        const mockReturnData = { data: {} };
        apiProvider.getData.mockReturnValueOnce(mockReturnData);
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);

        await getSectionPageContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          userContextType: 'anotherUserContextType',
        });

        expect(context.createSectionPageContext.mock.calls.length).toEqual(1);
        expect(context.createSectionPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          formData: mockReturnData,
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });
      });
    });

    it('should call getData with the correct params', async () => {
      apiProvider.getData.mockReturnValueOnce({ data: {} });

      await getSectionPageContext({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
      });

      expect(apiProvider.getData.mock.calls.length).toEqual(1);
      expect(apiProvider.getData).toHaveBeenCalledWith({
        endpointLocator: 'getSectionData',
        options: {
          solutionId: 'some-solution-id',
          sectionId: 'some-section-id',
        },
      });
    });

    it('should return the context', async () => {
      const mockReturnData = { data: {} };
      apiProvider.getData.mockReturnValueOnce(mockReturnData);
      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
      context.createSectionPageContext.mockReturnValueOnce(mockContext);

      const response = await getSectionPageContext({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
      });

      expect(response).toEqual(mockContext);
    });

    it('should throw an error when no data is returned from the ApiProvider', async () => {
      manifestProvider.getSubDashboardManifest.mockReturnValueOnce(sectionManifest);
      apiProvider.getData
        .mockResolvedValueOnce({});

      try {
        await getSectionPageContext({ solutionId: 'some-solution-id' });
      } catch (err) {
        expect(err).toEqual(new Error('No data returned'));
        expect(context.createSectionPageContext).not.toHaveBeenCalled();
      }
    });
  });

  describe('getSectionPageErrorContext', () => {
    afterEach(() => {
      manifestProvider.getSectionManifest.mockReset();
      context.createSectionPageContext.mockReset();
    });

    describe('userContextType not supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        context.createSectionPageContext.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        await getSectionPageErrorContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          sectionId: 'some-section-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'supplier',
        });
      });

      it('should call createSectionPageContext with the correct params', async () => {
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
        context.createSectionPageContext.mockReturnValueOnce(mockContext);

        await getSectionPageErrorContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
        });

        expect(context.createSectionPageContext.mock.calls.length).toEqual(1);
        expect(context.createSectionPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          formData: mockSectionData,
          validationErrors: mockValidationErrors,
          dashboardId: 'some-dashboard-id',
          userContextType: 'supplier',
        });
      });
    });

    describe('userContextType supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        apiProvider.getData.mockReset();
        context.createSectionPageContext.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        manifestProvider.getSectionManifest.mockReturnValueOnce(mockContext);

        await getSectionPageErrorContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
          userContextType: 'anotherUserContextType',
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          sectionId: 'some-section-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });
      });

      it('should call createSectionPageContext with the correct params', async () => {
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
        context.createSectionPageContext.mockReturnValueOnce(mockContext);

        await getSectionPageErrorContext({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
          userContextType: 'anotherUserContextType',
        });

        expect(context.createSectionPageContext.mock.calls.length).toEqual(1);
        expect(context.createSectionPageContext).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          formData: mockSectionData,
          validationErrors: mockValidationErrors,
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });
      });
    });

    it('should return the context', async () => {
      const mockReturnData = { data: {} };
      apiProvider.getData.mockReturnValueOnce(mockReturnData);
      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
      context.createSectionPageContext.mockReturnValueOnce(mockContext);

      const response = await getSectionPageErrorContext({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
        sectionData: mockSectionData,
        validationErrors: mockValidationErrors,
      });

      expect(response).toEqual(mockContext);
    });
  });

  describe('postSection', () => {
    afterEach(() => {
      manifestProvider.getSectionManifest.mockReset();
      context.createSectionPageContext.mockReset();
      apiProvider.putData.mockReset();
      postResponse.createPostSectionResponse.mockReset();
    });

    describe('userContextType not supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        context.createSectionPageContext.mockReset();
        apiProvider.putData.mockReset();
        transform.transformSectionData.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);

        await postSection({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          sectionId: 'some-section-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'supplier',
        });
      });

      it('should call createPostSectionResponse with the correct params', async () => {
        const mockTransformedData = { transformedData: 'some transformed data' };
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
        apiProvider.putData.mockReturnValueOnce({ data: {} });
        transform.transformSectionData.mockReturnValueOnce(mockTransformedData);

        await postSection({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
        });

        expect(postResponse.createPostSectionResponse.mock.calls.length).toEqual(1);
        expect(postResponse.createPostSectionResponse).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          userContextType: 'supplier',
        });
      });
    });

    describe('userContextType supplied', () => {
      afterEach(() => {
        manifestProvider.getSectionManifest.mockReset();
        context.createSectionPageContext.mockReset();
        apiProvider.putData.mockReset();
        transform.transformSectionData.mockReset();
      });

      it('should call getSectionManifest with the correct params', async () => {
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);

        await postSection({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
          userContextType: 'anotherUserContextType',
        });

        expect(manifestProvider.getSectionManifest.mock.calls.length).toEqual(1);
        expect(manifestProvider.getSectionManifest).toHaveBeenCalledWith({
          sectionId: 'some-section-id',
          dashboardId: 'some-dashboard-id',
          userContextType: 'anotherUserContextType',
        });
      });

      it('should call createPostSectionResponse with the correct params', async () => {
        const mockTransformedData = { transformedData: 'some transformed data' };
        manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
        apiProvider.putData.mockReturnValueOnce({ data: {} });
        transform.transformSectionData.mockReturnValueOnce(mockTransformedData);

        await postSection({
          solutionId: 'some-solution-id',
          dashboardId: 'some-dashboard-id',
          sectionId: 'some-section-id',
          sectionData: mockSectionData,
          validationErrors: mockValidationErrors,
          userContextType: 'anotherUserContextType',
        });

        expect(postResponse.createPostSectionResponse.mock.calls.length).toEqual(1);
        expect(postResponse.createPostSectionResponse).toHaveBeenCalledWith({
          solutionId: 'some-solution-id',
          sectionManifest,
          userContextType: 'anotherUserContextType',
        });
      });
    });

    it('should call transformSectionData with the correct params', async () => {
      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);

      await postSection({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
        sectionData: mockSectionData,
        validationErrors: mockValidationErrors,
      });

      expect(transform.transformSectionData.mock.calls.length).toEqual(1);
      expect(transform.transformSectionData).toHaveBeenCalledWith({
        sectionManifest,
        sectionData: mockSectionData,
      });
    });

    it('should call putData with the correct params', async () => {
      const mockTransformedData = { transformedData: 'some transformed data' };
      apiProvider.putData.mockReturnValueOnce({ data: {} });
      transform.transformSectionData.mockReturnValueOnce(mockTransformedData);

      await postSection({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
      });

      expect(apiProvider.putData.mock.calls.length).toEqual(1);
      expect(apiProvider.putData).toHaveBeenCalledWith({
        endpointLocator: 'putSectionData',
        options: {
          solutionId: 'some-solution-id',
          sectionId: 'some-section-id',
        },
        body: mockTransformedData,
      });
    });

    it('should return the context', async () => {
      apiProvider.putData.mockReturnValueOnce({ data: {} });
      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
      postResponse.createPostSectionResponse.mockReturnValueOnce(mockContext);

      const response = await postSection({
        solutionId: 'some-solution-id',
        dashboardId: 'some-dashboard-id',
        sectionId: 'some-section-id',
      });

      expect(response).toEqual(mockContext);
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

      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
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

      manifestProvider.getSectionManifest.mockReturnValueOnce(sectionManifest);
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
