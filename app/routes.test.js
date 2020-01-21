const request = require('supertest');
const { App } = require('../app');
const routes = require('../app/routes');
const dashboardControllers = require('../app/pages/dashboard/controller');
const sectionControllers = require('../app/pages/section/controller');
const subsectionControllers = require('../app/pages/dashboard/subDashboards/controller');
const previewControllers = require('../app/pages/preview/controller');

const mockDashboardContext = {
  title: 'Dashboard title',
  mainAdvice: undefined,
  additionalAdvice: undefined,
  previewUrl: '/',
  submitForModerationUrl: '/',
  returnToDashboardUrl: '/',
  errors: undefined,
  sectionGroups: [
    {
      id: 'sectiongroup-id',
      title: 'Sectiongroup Title',
      sections: [],
    },
  ],
};
const mockSectionContext = {
  title: 'Section Title',
  submitActionUrl: '/s',
  mainAdvice: 'Section Main Advice',
  additionalAdvice: [
    'Section additional advice',
  ],
  warningAdvice: undefined,
  returnToDashboardUrl: '/',
  submitText: 'submitText',
  errors: undefined,
  questions: [
    {
      id: 'a-question',
      type: 'bulletpoint-list',
      mainAdvice: undefined,
      additionalAdvice: undefined,
      footerAdvice: undefined,
      fields: [],
    },
  ],
};
const mockSectionPostData = {
  'a-question': [
    'bullet 1',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ],
};
const mockPostSectionContext = {
  title: 'Post Section Title',
  submitActionUrl: '/',
  mainAdvice: 'post section main advice',
  additionalAdvice: [
    'post section additional advice',
  ],
  warningAdvice: undefined,
  returnToDashboardUrl: '/',
  submitText: 'submitText',
  errors: [
    {
      text: 'This is over the character limit',
      href: '#',
    },
  ],
  questions: [
    {
      id: 'a-question',
      type: 'bulletpoint-list',
      mainAdvice: undefined,
      additionalAdvice: undefined,
      footerAdvice: undefined,
      fields: [],
    },
  ],
};
const mockPreviewContext = {
  sections: {
    'solution-description': { answers: [Object] },
    features: { answers: [Object] },
    'contact-details': { answers: [Object] },
    capabilities: { answers: [Object] },
  },
};
const mockSectionErrorContext = {
  ...mockSectionContext,
  errors: [
    {
      text: 'This is over the character limit',
      href: '#',
    },
  ],
};

describe('GET /healthcheck', () => {
  it('should return the correct status and text', () => {
    const app = new App().createApp();
    app.use('/', routes);

    return request(app)
      .get('/healthcheck')
      .expect(200)
      .then((res) => {
        expect(res.text).toBe('Marketing pages is Running!!!');
      });
  });
});

describe('GET /solution/:solutionId', () => {
  it('should return the correct status and text if there is no error', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDashboardContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return error page if there is an error', () => {
    dashboardControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="dashboard"')).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET /solution/:solutionId/section/:sectionId', () => {
  it('should return the correct status and text if there is no error', () => {
    sectionControllers.getSectionPageContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockSectionContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/section/a-section')
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return error page if there is an error', () => {
    sectionControllers.getMarketingPageDashboardContext = jest.fn()
      .mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('POST /solution/:solutionId/section/:sectionId', () => {
  afterEach(() => {
    sectionControllers.postSection.mockReset();
  });

  it('should return the correct status and text if response.success is true', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.resolve({ ...mockPostSectionContext, success: true }));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/section/features')
      .send(mockSectionPostData)
      .expect(302)
      .then((res) => {
        expect(res.redirect).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return the correct status and text if response.success is false', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.resolve({ 'listing-2': 'maxLength' }));
    sectionControllers.getSectionPageErrorContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockSectionErrorContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/section/features')
      .send(mockSectionPostData)
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<div data-test-id="error-summary">')).toEqual(true);
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionErrorContext.title}</h2>`)).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        sectionControllers.getSectionPageErrorContext.mockReset();
      });
  });

  it('should return error page if there is an api error', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('er')));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/section/a-section')
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET /solution/:solutionId/dashboard/:dashboardId', () => {
  it('should return the correct status and text if there is no error', () => {
    subsectionControllers.getSubDashboardPageContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDashboardContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/dashboard/a-dashboard')
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="sub-dashboard-title">${mockDashboardContext.title}</h2>`)).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return error page if there is an error', () => {
    subsectionControllers.getSubDashboardPageContext = jest.fn()
      .mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('data-test-id="sub-dashboard-title"')).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET /solution/:solutionId/dashboard/:dashboardId/section/:sectionId', () => {
  afterEach(() => {
    sectionControllers.getSectionPageContext.mockReset();
  });
  it('should return the correct status and text if there is no error', () => {
    sectionControllers.getSectionPageContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockSectionContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/dashboard/a-dashboard/section/a-section')
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return error page if there is an error', () => {
    sectionControllers.getSectionPageContext = jest.fn().mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('POST /solution/:solutionId/dashboard/:dashboardId/section/:sectionId', () => {
  afterEach(() => {
    sectionControllers.postSection.mockReset();
  });

  it('should return the correct status and text if response.success is true', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.resolve({ ...mockPostSectionContext, success: true }));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/dashboard/features/section/feat')
      .send(mockSectionPostData)
      .expect(302)
      .then((res) => {
        expect(res.redirect).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return the correct status and text if response.success is false', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.resolve({ 'listing-2': 'maxLength' }));
    sectionControllers.getSectionPageErrorContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockSectionErrorContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/dashboard/features/section/feat')
      .send(mockSectionPostData)
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<div data-test-id="error-summary">')).toEqual(true);
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionErrorContext.title}</h2>`)).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
        sectionControllers.getSectionPageErrorContext.mockReset();
      });
  });

  it('should return error page if there is an api error', () => {
    sectionControllers.postSection = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('er')));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .post('/solution/1/dashboard/a-dashboard/section/a-section')
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.text.includes(`<h2 data-test-id="section-title">${mockSectionContext.title}</h2>`)).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET /solution/:solutionId/preview', () => {
  afterEach(() => {
    previewControllers.getPreviewPageContext.mockReset();
  });

  it('should return the correct status and text if there is no error', () => {
    previewControllers.getPreviewPageContext = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPreviewContext));
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1/preview')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1>Preview Page</h1>')).toEqual(true);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(false);
      });
  });

  it('should return error page if there is an error', () => {
    previewControllers.getPreviewPageContext = jest.fn().mockImplementation(() => Promise.reject());
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/solution/1')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1>Preview Page</h1>')).toEqual(false);
        expect(res.text.includes('data-test-id="error-page-title"')).toEqual(true);
      });
  });
});

describe('GET *', () => {
  afterEach(() => {
    previewControllers.getPreviewPageContext.mockReset();
  });

  it('should return error page if url cannot be matched', () => {
    const app = new App().createApp();
    app.use('/', routes);
    return request(app)
      .get('/aaaa')
      .expect(200)
      .then((res) => {
        expect(res.text.includes('<h1 class="nhsuk-heading-l nhsuk-u-padding-left-3" data-test-id="error-page-title">Error: Incorrect url - please check it is valid and try again</h1>')).toEqual(true);
      });
  });
});
