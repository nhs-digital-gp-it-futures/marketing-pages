/* eslint-disable camelcase */
// NHS.UK frontend
import nhsuk_skipLink from 'nhsuk-frontend/packages/components/skip-link/skip-link';

// GOV.UK frontend
import { initAll } from 'govuk-frontend';

// HTML5 polyfills
import 'nhsuk-frontend/packages/components/details/details';

// Initialise components
nhsuk_skipLink();
initAll();
