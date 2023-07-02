const { assert } = require("chai");
const axios = require("axios");
const { PAGES_URLS } = require("../const");

let bug_id = '';

if (process.env.BUG_ID) {
  bug_id = process.env.BUG_ID;
}

describe('Корзина', function () {
  it('При оформление заказа должен возвращаться корректный id', async ({ browser }) => {
    browser.execute(() => window.localStorage.removeItem('example-store-cart'));
    const order = {
      form: {
        name: 'TestName',
        phone: 8999999999,
        address: 'TestAddress',
      },
      cart: {
        0: { id: 0, name: 'test-name-1', price: 1000, count: 3 },
        1: { id: 1, name: 'test-name-2', price: 2000, count: 1 },
      }
    }

    const res = await axios.post(`http://localhost:3000/hw/store/api/checkout?bug_id=${ bug_id }`, order);
    await browser.url(`${ PAGES_URLS.cart }?bug_id=${ bug_id }`)
    const orderId = res.data.id;
    assert.isBelow(
      orderId, 100000000,
      'При оформлении заказа, должен вернуться orderId не с большим количеством цифр',
    );

  });
})
