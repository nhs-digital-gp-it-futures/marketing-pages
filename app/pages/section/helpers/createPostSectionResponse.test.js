import { createPostSectionResponse } from './createPostSectionResponse';

describe('createPostSectionResponse', () => {
  it('should create a context from the section manifest', () => {
    const expectedContext = {
      success: true,
      redirectUrl: '/solution/some-solution-id',
    };

    const sectionManifest = {};

    const context = createPostSectionResponse({ solutionId: 'some-solution-id', sectionManifest });

    expect(context).toEqual(expectedContext);
  });

  it('should create a context from the sub section manifest', () => {
    const expectedContext = {
      success: true,
      redirectUrl: '/solution/some-solution-id/some-parent-section-id',
    };

    const sectionManifest = {
      successfulSubmitResponsePath: 'some-parent-section-id',
    };

    const context = createPostSectionResponse({ solutionId: 'some-solution-id', sectionManifest });

    expect(context).toEqual(expectedContext);
  });
});
