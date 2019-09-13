import createTestcafe from 'testcafe';
import { App } from '../app';
import routes from '../app/routes';

let testcafe;
let server;

createTestcafe('localhost')
  .then((tc) => {
    testcafe = tc;

    const app = new App().createApp();
    app.use('/', routes);

    server = app.listen('1234');

    return tc.createRunner()
      .src(['integration-tests/*.test.js'])
      .browsers('chrome')
      .concurrency(1)
      .run();
  })
  .then((failCount) => {
    server.close();
    testcafe.close();
  });
