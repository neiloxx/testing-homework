const BASE_URL = 'http://localhost:3000/hw/store';

const PAGES_URLS = {
  home: BASE_URL,
  catalog: `${ BASE_URL }/catalog`,
  delivery: `${ BASE_URL }/delivery`,
  contacts: `${ BASE_URL }/contacts`,
  cart: `${ BASE_URL }/cart/`,
}

const LAYOUTS = {
  'large': {
    width: 1920,
    height: 20000,
  },
  'medium': {
    width: 767,
    height: 20000,
  },
  'small': {
    width: 320,
    height: 20000,
  },
}

module.exports = { PAGES_URLS, LAYOUTS }