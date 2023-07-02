const { assert } = require("chai");
const { PAGES_URLS } = require("../const");
const axios = require("axios");

let bug_id = '';

if (process.env.BUG_ID) {
  bug_id = process.env.BUG_ID;
}

describe('Каталог', function () {
  it('В каталоге должны отображаться товары, список которых приходит с сервера', async function ({ browser }) {
    const res = await axios.get(`http://localhost:3000/hw/store/api/products?bug_id=${ bug_id }`);
    const resProducts = res.data.map(pr => pr.name);
    await browser.url(`${ PAGES_URLS.catalog }?bug_id=${ bug_id }`);
    await browser.$('.ProductItem').waitForExist()
    const productsName = await browser.$$('.ProductItem-Name').map(pr => pr.getText());
    assert.deepEqual(
      resProducts, productsName, 'В каталоге должны отображаться товары, список которых приходит с сервера');
  });

  it('При запросе товара по id должен возвращаться товар с корректным id', async function () {
    const id = 15;
    const res = await axios.get(`http://localhost:3000/hw/store/api/products/${ id }?bug_id=${ bug_id }`);
    assert.equal(id, res.data.id, '');
  });

  it('Содержимое корзины должно сохраняться между перезагрузками страницы', async ({ browser }) => {
    browser.execute(() => window.localStorage.setItem(
      'example-store-cart',
      JSON.stringify({ 0: { name: "Fantastic Fish", count: 1, price: 271 } })
    ));

    await browser.url(`${ PAGES_URLS.cart }?bug_id=${ bug_id }`);
    const cartBeforeRefresh = await browser.$('.Cart-Table');
    assert.equal(await cartBeforeRefresh.isDisplayed(), true, 'Товар должен быть в корзине');
    await browser.refresh();
    const cartAfterRefresh = await browser.$('.Cart-Table');
    browser.execute(() => window.localStorage.removeItem('example-store-cart'));
    assert.equal(
      await cartBeforeRefresh.getText(), await cartAfterRefresh.getText(),
      'Содержимое корзины должно сохраниться после перезагрузки',
    );
  });
})