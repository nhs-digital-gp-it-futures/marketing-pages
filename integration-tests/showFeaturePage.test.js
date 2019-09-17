import { Selector } from 'testcafe';

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
