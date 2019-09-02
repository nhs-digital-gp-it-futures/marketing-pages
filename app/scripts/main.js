/* eslint-disable camelcase */
// NHS.UK frontend
import nhsuk_header from '../../node_modules/nhsuk-frontend/packages/components/header/header';
import nhsuk_skipLink from '../../node_modules/nhsuk-frontend/packages/components/skip-link/skip-link';
import autocomplete from '../../node_modules/nhsuk-frontend/packages/components/header/autocomplete';

// HTML5 polyfills
import '../../node_modules/nhsuk-frontend/packages/components/details/details.polyfill';

// Initialise components
nhsuk_header();
nhsuk_skipLink();
autocomplete();
