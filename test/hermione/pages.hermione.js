const { assert } = require("chai");
const { LAYOUTS, PAGES_URLS } = require('../const');

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
      await checkAdaptive(browser, PAGES_URLS.home, 'homePage', 'large');
      await checkAdaptive(browser, PAGES_URLS.home, 'homePageMedium', 'medium');
      await checkAdaptive(browser, PAGES_URLS.home, 'homePageSmall', 'small');
    });

    it('Страница Delivery существует и адаптируется под ширину экрана', async function ({ browser }) {
      await checkAdaptive(browser, PAGES_URLS.delivery, 'deliveryPage', 'large');
      await checkAdaptive(browser, PAGES_URLS.delivery, 'deliveryPageMedium', 'medium');
      await checkAdaptive(browser, PAGES_URLS.delivery, 'deliveryPageSmall', 'small');
    });
  }
);
