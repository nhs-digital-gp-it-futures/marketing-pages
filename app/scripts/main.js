/* eslint-disable camelcase */
// NHS.UK frontend
import nhsuk_header from 'nhsuk-frontend/packages/components/header/header';
import nhsuk_skipLink from 'nhsuk-frontend/packages/components/skip-link/skip-link';
import autocomplete from 'nhsuk-frontend/packages/components/header/headerAutoComplete';

// HTML5 polyfills
import 'nhsuk-frontend/packages/components/details/details';

// Initialise components
nhsuk_header();
nhsuk_skipLink();
autocomplete();
