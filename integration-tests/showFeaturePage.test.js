import { Selector } from 'testcafe';
import { ManifestProvider } from '../app/forms/manifestProvider';

const mocks = () => {
};

const pageSetup = async (t) => {
  mocks();
  await t.navigateTo('http://localhost:1234/S100000-001/task/features');
};

fixture('Show Feature page');

test('should render the Features page title', async (t) => {
  pageSetup(t);

  const title = Selector('h1');

  await t
    .expect(title.innerText).eql('Features');
});

test('should render main advice of question', async (t) => {
  pageSetup(t);

  const mainAdvice = Selector('[data-test-id="task-question-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Add up to 10 features that describe your Solution.');
});

test('should render all the advice of question', async (t) => {
  pageSetup(t);

  const taskManifest = new ManifestProvider().getTaskManifest('features');
  const expectedAdditionalAdvice = taskManifest.questions[0].additionalAdvice.join('\n');

  const additionalAdvice = Selector('[data-test-id="task-question-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render 10 text fields', async (t) => {
  pageSetup(t);

  await Promise.all(Array(10).fill().map(async (_, i) => {
    const theField = Selector(`[data-test-id="features-listing-${i + 1}"]`);
    await t
      .expect(theField.find('input').count).eql(1);
  }));
});

test('should render 10 text fields', async (t) => {
  pageSetup(t);

  const submitButton = Selector('[data-test-id="task-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1);
});
