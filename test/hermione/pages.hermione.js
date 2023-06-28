const BASE_URL = 'http://localhost:3000/hw/store/';

const PAGES = {
    home: BASE_URL,
    catalog: `${BASE_URL}/catalog`,
    delivery: `${BASE_URL}/delivery`,
    contacts: `${BASE_URL}/contacts`,
    cart: `${BASE_URL}/cart`,
}

const LAYOUTS = {
    'large': {
        width: 1920,
        height: 1080,
    },
    'medium': {
        width: 767,
        height: 1080,
    },
    'small': {
        width: 320,
        height: 1080,
    },
}

describe('Верстка должна адаптироваться под ширину экрана', async function() {
    it('Страница Home адаптируется под ширину экрана', async function() {
        await this.browser.url(PAGES.home);
        await this.browser.assertView('homePage', '.Application');
    });
});
