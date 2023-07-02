const { LAYOUTS, PAGES_URLS } = require('../const');

let bug_id = '';

if (process.env.BUG_ID) {
  bug_id = process.env.BUG_ID;
}

async function checkAdaptive(browser, url, pageName, size) {
  await browser.setWindowSize(LAYOUTS[size].width, LAYOUTS[size].height);
  await browser.url(url);
  await browser.assertView(pageName, '.Application', {
    allowViewportOverflow: false,
  });
}

describe(
  'В магазине должны быть страницы: главная, каталог, условия доставки, контакты. Верстка должна адаптироваться под ширину экрана',
  function () {
    it('Страница Home существует и адаптируется под ширину экрана', async function ({ browser }) {
      await checkAdaptive(browser, `${PAGES_URLS.home}?bug_id=${bug_id}`, 'homePage', 'large');
      await checkAdaptive(browser, `${PAGES_URLS.home}?bug_id=${bug_id}`, 'homePageMedium', 'medium');
      await checkAdaptive(browser, `${PAGES_URLS.home}?bug_id=${bug_id}`, 'homePageSmall', 'small');
    });

    it('Страница Delivery существует и адаптируется под ширину экрана', async function ({ browser }) {
      await checkAdaptive(browser, `${PAGES_URLS.delivery}?bug_id=${bug_id}`, 'deliveryPage', 'large');
      await checkAdaptive(browser, `${PAGES_URLS.delivery}?bug_id=${bug_id}`, 'deliveryPageMedium', 'medium');
      await checkAdaptive(browser, `${PAGES_URLS.delivery}?bug_id=${bug_id}`, 'deliveryPageSmall', 'small');
    });

    it('Страница Contact существует и адаптируется под ширину экрана', async function ({ browser }) {
      await checkAdaptive(browser, `${PAGES_URLS.contacts}?bug_id=${bug_id}`, 'contactsPage', 'large');
      await checkAdaptive(browser, `${PAGES_URLS.contacts}?bug_id=${bug_id}`, 'contactsPageMedium', 'medium');
      await checkAdaptive(browser, `${PAGES_URLS.contacts}?bug_id=${bug_id}`, 'contactsPageSmall', 'small');
    });
  }
);
