import { componentTester } from '../test-utils/componentTester';
import { publicBrowseBaseUrl } from '../config';

const setup = {
  template: {
    path: 'includes/header.njk',
  },
};

describe('header', () => {
  it('should render the header banner', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      const headerBanner = $('header[data-test-id="header-banner"]');
      expect(headerBanner.length).toEqual(1);
    });
  }));

  it('should render logo with correct href and aria-label', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      const logoLink = $('header[data-test-id="header-banner"] .nhsuk-header__logo a');
      expect(logoLink.length).toEqual(1);
      expect(logoLink.attr('href')).toEqual(publicBrowseBaseUrl);
      expect(logoLink.attr('aria-label')).toEqual('Buying Catalogue Homepage');
    });
  }));
});
