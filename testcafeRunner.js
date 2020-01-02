import createTestcafe from 'testcafe';
import { App } from './app';
import routes from './app/routes';

let testcafe;
let server;

const browserFromArgs = process.argv.slice(2, 3);
const browserToRun = browserFromArgs.length > 0 ? browserFromArgs : 'chrome:headless';

const testFromArgs = process.argv.slice(3, 4);
const testsToRun = testFromArgs ? `**/*${testFromArgs}*/ui.test.js` : '**/*ui.test.js';

createTestcafe('localhost')
  .then((tc) => {
    testcafe = tc;

    const app = new App().createApp();
    app.use('/', routes);

    server = app.listen('1234');

    return tc.createRunner()
      .src([testsToRun])
      .browsers(browserToRun)
      .concurrency(1)
      .reporter(['spec', {
        name: 'nunit',
        output: 'integration-test-report.xml',
      }])
      .run();
  })
  .then((failCount) => {
    server.close();
    testcafe.close();
  });
