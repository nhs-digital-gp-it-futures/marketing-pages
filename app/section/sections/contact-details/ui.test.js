import nock from 'nock';
import { Selector, ClientFunction } from 'testcafe';
import { ManifestProvider } from '../../../manifestProvider';
import dashboardWithCompleteSections from '../../../../fixtures/dashboardWithCompleteSections.json';

const contactDetailsMarketingData = {
  'contact-1': {
    'first-name': 'Peter',
    'last-name': 'Parker',
    'phone-number': '01234 567890',
    'email-address': 'peter.parker@avengers.com',
    'department-name': 'Web Developer',
  },
  'contact-2': {
    'first-name': 'Bruce',
    'last-name': 'Banner',
    'phone-number': '04321 098765',
    'email-address': 'bruce.banner@avengers.com',
    'department-name': 'Eco Warrior',
  },
};

const mocks = (withMarketingData) => {
  if (withMarketingData) {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/contact-details')
      .reply(200, contactDetailsMarketingData);
  } else {
    nock('http://localhost:8080')
      .get('/api/v1/Solutions/S100000-001/sections/contact-details')
      .reply(200, {});
  }
};

const pageSetup = async (t, withMarketingData = false) => {
  mocks(withMarketingData);
  await t.navigateTo('http://localhost:1234/solution/S100000-001/section/contact-details');
};

fixture('Show Contact Details page')
  .afterEach(async (t) => {
    const isDone = nock.isDone();
    if (!isDone) {
      nock.cleanAll();
    }

    await t.expect(isDone).ok('Not all nock interceptors were used!');
  });

test('should render the Contact details page title', async (t) => {
  await pageSetup(t);

  const title = Selector('[data-test-id="section-title"]');

  await t
    .expect(title.innerText).eql('Contact details');
});

test('should render main advice of section', async (t) => {
  await pageSetup(t);

  const mainAdvice = Selector('[data-test-id="section-main-advice"]');

  await t
    .expect(mainAdvice.innerText).eql('Provide the following contact details to allow the buyer to contact you.');
});

test('should render all the advice of section', async (t) => {
  await pageSetup(t);

  const sectionManifest = new ManifestProvider().getSectionManifest({ sectionId: 'contact-details' });
  const expectedAdditionalAdvice = sectionManifest.additionalAdvice.join('\n\n');

  const additionalAdvice = Selector('[data-test-id="section-additional-advice"]');

  await t
    .expect(additionalAdvice.innerText).eql(expectedAdditionalAdvice);
});

test('should render the contact 1 question', async (t) => {
  await pageSetup(t);

  const contact1Question = Selector('[data-test-id="question-contact-1"]');
  const contact1FirstName = contact1Question.find('[data-test-id="question-contact-1[first-name]"]');
  const contact1LastName = contact1Question.find('[data-test-id="question-contact-1[last-name]"]');
  const contact1PhoneNumber = contact1Question.find('[data-test-id="question-contact-1[phone-number]"]');
  const contact1EmailAddress = contact1Question.find('[data-test-id="question-contact-1[email-address]"]');
  const contact1DepartmentName = contact1Question.find('[data-test-id="question-contact-1[department-name]"]');

  await t
    .expect(contact1Question.exists).ok()
    .expect(contact1Question.find('[data-test-id="multi-question-main-advice"]').innerText).eql('Contact 1')
    .expect(contact1Question.find('[data-test-id="multi-question-additional-advice"]').innerText)
    .eql('Provide the details you would like to be point of contact for this Solution.')

    .expect(contact1FirstName.exists).ok()
    .expect(contact1FirstName.find('label.nhsuk-label').innerText).eql('First name (optional)')
    .expect(contact1FirstName.find('input').count).eql(1)

    .expect(contact1LastName.exists).ok()
    .expect(contact1LastName.find('label.nhsuk-label').innerText).eql('Last name (optional)')
    .expect(contact1LastName.find('input').count).eql(1)

    .expect(contact1PhoneNumber.exists).ok()
    .expect(contact1PhoneNumber.find('label.nhsuk-label').innerText).eql('Phone number (optional)')
    .expect(contact1PhoneNumber.find('input').count).eql(1)

    .expect(contact1EmailAddress.exists).ok()
    .expect(contact1EmailAddress.find('label.nhsuk-label').innerText).eql('Email address (optional)')
    .expect(contact1EmailAddress.find('input').count).eql(1)

    .expect(contact1DepartmentName.exists).ok()
    .expect(contact1DepartmentName.find('label.nhsuk-label').innerText).eql('Job sector (optional)')
    .expect(contact1DepartmentName.find('input').count).eql(1);
});

test('should render the contact 2 question', async (t) => {
  await pageSetup(t);

  const contact2Question = Selector('[data-test-id="question-contact-2"]');
  const contactFirstName = contact2Question.find('[data-test-id="question-contact-2[first-name]"]');
  const contact2LastName = contact2Question.find('[data-test-id="question-contact-2[last-name]"]');
  const contact2PhoneNumber = contact2Question.find('[data-test-id="question-contact-2[phone-number]"]');
  const contact2EmailAddress = contact2Question.find('[data-test-id="question-contact-2[email-address]"]');
  const contact2DepartmentName = contact2Question.find('[data-test-id="question-contact-2[department-name]"]');

  await t
    .expect(contact2Question.exists).ok()
    .expect(contact2Question.find('[data-test-id="multi-question-main-advice"]').innerText).eql('Contact 2')
    .expect(contact2Question.find('[data-test-id="multi-question-additional-advice"]').innerText)
    .eql('Provide the details you would like to be point of contact for this Solution.')

    .expect(contactFirstName.exists).ok()
    .expect(contactFirstName.find('label.nhsuk-label').innerText).eql('First name (optional)')
    .expect(contactFirstName.find('input').count).eql(1)

    .expect(contact2LastName.exists).ok()
    .expect(contact2LastName.find('label.nhsuk-label').innerText).eql('Last name (optional)')
    .expect(contact2LastName.find('input').count).eql(1)

    .expect(contact2PhoneNumber.exists).ok()
    .expect(contact2PhoneNumber.find('label.nhsuk-label').innerText).eql('Phone number (optional)')
    .expect(contact2PhoneNumber.find('input').count).eql(1)

    .expect(contact2EmailAddress.exists).ok()
    .expect(contact2EmailAddress.find('label.nhsuk-label').innerText).eql('Email address (optional)')
    .expect(contact2EmailAddress.find('input').count).eql(1)

    .expect(contact2DepartmentName.exists).ok()
    .expect(contact2DepartmentName.find('label.nhsuk-label').innerText).eql('Job sector (optional)')
    .expect(contact2DepartmentName.find('input').count).eql(1);
});

test('should populate the contacts with existing data', async (t) => {
  pageSetup(t, true);

  const theQuestions = Selector('form');

  await t
    .expect(theQuestions.find('[data-test-id="question-contact-1[first-name]"]').find('input').value).eql('Peter')
    .expect(theQuestions.find('[data-test-id="question-contact-1[last-name]"]').find('input').value).eql('Parker')
    .expect(theQuestions.find('[data-test-id="question-contact-1[phone-number]"]').find('input').value).eql('01234 567890')
    .expect(theQuestions.find('[data-test-id="question-contact-1[email-address]"]').find('input').value).eql('peter.parker@avengers.com')
    .expect(theQuestions.find('[data-test-id="question-contact-1[department-name]"]').find('input').value).eql('Web Developer')

    .expect(theQuestions.find('[data-test-id="question-contact-2[first-name]"]').find('input').value).eql('Bruce')
    .expect(theQuestions.find('[data-test-id="question-contact-2[last-name]"]').find('input').value).eql('Banner')
    .expect(theQuestions.find('[data-test-id="question-contact-2[phone-number]"]').find('input').value).eql('04321 098765')
    .expect(theQuestions.find('[data-test-id="question-contact-2[email-address]"]').find('input').value).eql('bruce.banner@avengers.com')
    .expect(theQuestions.find('[data-test-id="question-contact-2[department-name]"]').find('input').value).eql('Eco Warrior');
});

test('should render the submit button', async (t) => {
  await pageSetup(t);

  const submitButton = Selector('[data-test-id="section-submit-button"]');

  await t
    .expect(submitButton.find('button').count).eql(1)
    .expect(submitButton.find('button').innerText).eql('Save and return to all sections');
});


test('should render the return to all sections link', async (t) => {
  await pageSetup(t);

  const link = Selector('[data-test-id="section-back-link"] a');

  await t
    .expect(link.innerText).eql('Return to all sections');
});

test('should return to the marketing data dashboard when the return to all sections is clicked', async (t) => {
  await pageSetup(t);

  nock('http://localhost:8080')
    .get('/api/v1/Solutions/S100000-001/dashboard')
    .reply(200, dashboardWithCompleteSections);

  const getLocation = ClientFunction(() => document.location.href);

  const link = Selector('[data-test-id="section-back-link"]');

  await t
    .click(link.find('a'))
    .expect(getLocation()).notContains('section')
    .expect(getLocation()).contains('/solution/S100000-001');
});
