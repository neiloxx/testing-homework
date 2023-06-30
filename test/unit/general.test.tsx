import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../test-utils';
import { Application } from '../../src/client/Application';

const HEADER_LINKS = [ 'catalog', 'delivery', 'contacts', 'cart' ];
const SHOP_NAME = 'Example store';

describe('Общие требования выполнены', () => {
  it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
    renderWithProviders(<Application />);
    const links = HEADER_LINKS.map(link => screen.queryByRole('link', { name: new RegExp(link, 'i') }));
    links.forEach((link, idx) => expect(link.getAttribute('href')).toStrictEqual(`/${ HEADER_LINKS[idx] }`));
  });

  it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
    renderWithProviders(<Application />);
    const mainLink = screen.getByRole('link', { name: SHOP_NAME });
    expect(mainLink.getAttribute('href')).toStrictEqual('/');
  });
});
