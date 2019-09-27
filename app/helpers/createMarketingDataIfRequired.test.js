import { createMarketingDataIfRequired } from './createMarketingDataIfRequired';


describe('createMarketingDataIfRequired', () => {
  const createDashboardManifest = sectionGroups => ({
    id: 'marketing-page-dashboard',
    sectionGroups,
  });

  const createSectionGroup = (id, title, sections) => ({
    id,
    title,
    sections,
  });

  const createSection = (id, title) => ({
    id,
    title,
  });

  describe('when initial load and no marketing data exists', () => {
    it('should create the inital marketing data for 1 section', () => {
      const expectedInitialMarketingData = {
        sections: [
          {
            id: 'first-section',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSectionGroup('first-section-group', 'The first section group',
            [
              createSection('first-section', 'The first section'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });

    it('should create the inital marketing data for 2 sections', () => {
      const expectedInitialMarketingData = {
        sections: [
          {
            id: 'first-section',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'second-section',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSectionGroup('first-section-group', 'The first section group',
            [
              createSection('first-section', 'The first section'),
              createSection('second-section', 'The second section'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });

    it('should create the inital marketing data for sections with multiple sectionGroups', () => {
      const expectedInitialMarketingData = {
        sections: [
          {
            id: 'first-section',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'second-section',
            data: {},
            status: 'INCOMPLETE',
          },
          {
            id: 'third-section',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSectionGroup('first-section-group', 'The first section group',
            [
              createSection('first-section', 'The first section'),
              createSection('second-section', 'The second section'),
            ]),
          createSectionGroup('second-section-group', 'The second section group',
            [
              createSection('third-section', 'The third section'),
            ]),
        ],
      );

      const existingSolutionData = {};

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedInitialMarketingData);
    });
  });

  describe('when there is existing marketing data', () => {
    it('should return the existing marketing data for the section', () => {
      const expectedMarketingData = {
        sections: [
          {
            id: 'first-section',
            data: {},
            status: 'COMPLETE',
          },
        ],
      };

      const existingSolutionData = {
        marketingData: {
          sections: [
            {
              id: 'first-section',
              data: {},
              status: 'COMPLETE',
            },
          ],
        },
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSectionGroup('first-section-group', 'The first section-group',
            [
              createSection('first-section', 'The first section'),
            ]),
        ],
      );

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedMarketingData);
    });

    it('should return the existing marketing data for the section and initial marketing data for a section that does not exist', () => {
      const expectedMarketingData = {
        sections: [
          {
            id: 'first-section',
            data: {},
            status: 'COMPLETE',
          },
          {
            id: 'second-section',
            data: {},
            status: 'INCOMPLETE',
          },
        ],
      };

      const existingSolutionData = {
        marketingData: {
          sections: [
            {
              id: 'first-section',
              data: {},
              status: 'COMPLETE',
            },
          ],
        },
      };

      const dashboardManifest = createDashboardManifest(
        [
          createSectionGroup('first-section-group', 'The first section-group',
            [
              createSection('first-section', 'The first section'),
              createSection('second-section', 'The second section'),
            ]),
        ],
      );

      const initialMarketingData = createMarketingDataIfRequired(
        dashboardManifest, existingSolutionData,
      );

      expect(initialMarketingData).toEqual(expectedMarketingData);
    });
  });
});
