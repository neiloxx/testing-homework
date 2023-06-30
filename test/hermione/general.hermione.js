const { assert } = require("chai");
const { PAGES_URLS } = require('../const');

describe('Общие требования', async function () {
  it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер', async function ({ browser }) {
    browser.url(`${ PAGES_URLS.home }`);
    const menu = await browser.$('.Application-Menu');
    const toggle = await browser.$('.Application-Toggler');

    assert.equal(await toggle.isDisplayed(), false, 'Гамбургер должен быть скрыт');
    assert.equal(await menu.isDisplayed(), true, 'Меню должно быть отображено');

    await browser.setWindowSize(575, 1000);

    assert.equal(await toggle.isDisplayed(), true, 'Гамбургер должен быть отображен');
    assert.equal(await menu.isDisplayed(), false, 'Меню должно быть скрыто');
  });

  it('При выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
    await browser.setWindowSize(575, 1000);
    await browser.url(`${ PAGES_URLS.home }?bug_id=4`);

    const menu = await browser.$('.Application-Menu');
    const toggle = await browser.$('.Application-Toggler');
    const links = await browser.$$('.nav-link');


    for (let link of links) {
      await toggle.click();
      assert.equal(await menu.isDisplayed(), true, 'Меню должно быть отображено');
      await link.click();
      assert.equal(await menu.isDisplayed(), false, 'Меню должно быть скрыто');
    }
  });
})
