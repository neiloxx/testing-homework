import React from 'react';
import { renderWithProviders } from '../test-utils';
import { Cart } from '../../src/client/pages/Cart';
import { clearCart, initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { screen } from '@testing-library/react';
import { Application } from '../../src/client/Application';
import userEvent from '@testing-library/user-event';
import { createStore } from 'redux';
import { CartItem } from '../../src/common/types';

describe('Корзина', () => {
  const initState: { cart: (Record<number, CartItem & { id?: number }>), products: any } = {
    cart: {
      0: { id: 0, name: 'test-name-1', price: 1000, count: 3 },
      1: { id: 1, name: 'test-name-2', price: 2000, count: 1 },
    },
    products: [
      { id: 0, name: 'test-name-1', price: 1000 },
      { id: 1, name: 'test-name-2', price: 2000 },
    ]
  }

  const store = createStore(() => initState);

  it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
    renderWithProviders(<Application />, { store: store });
    expect(screen.getByText(/cart \(2\)/i)).toBeInTheDocument();
  })

  it('В корзине должна отображаться таблица с добавленными в нее товарами', () => {
    const { container } = renderWithProviders(<Cart />, { store: store });
    expect(container.querySelector('.Cart-Table')).toBeInTheDocument();
  });

  it('Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
    const { container } = renderWithProviders(<Cart />, { store: store });

    expect(container.querySelector('.Cart-Index')).toBeInTheDocument();
    expect(container.querySelector('.Cart-Name')).toBeInTheDocument();
    expect(container.querySelector('.Cart-Price')).toBeInTheDocument();
    expect(container.querySelector('.Cart-Count')).toBeInTheDocument();
    expect(container.querySelector('.Cart-OrderPrice')).toBeInTheDocument();
  });

  it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const currentState = { ...initState };
    const user = userEvent;
    const mockCartApi = new CartApi();
    mockCartApi.getState = () => (currentState.cart);
    mockCartApi.setState = (cart) => {
      currentState.cart = cart;
    };

    const store = initStore(new ExampleApi(''), mockCartApi);

    const { container } = renderWithProviders(<Cart />, { store });
    const clearButton = screen.getByRole('button', { name: 'Clear shopping cart' });

    expect(clearButton).toBeInTheDocument();
    expect(container.querySelector('.Cart-Table')).toBeInTheDocument();
    await user.click(clearButton);
    expect(currentState.cart).toStrictEqual({});
    expect(container.querySelector('.Cart-Table')).not.toBeInTheDocument();
  });

  it('Если корзина пустая, должна отображаться ссылка на каталог товаров', () => {
    renderWithProviders(<Cart />, {
      store: createStore(() => ({ cart: {}, products: {} })
      )
    });
    const link = screen.getByRole('link', { name: /catalog/ });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/catalog');
  });

  afterEach(() => store.dispatch(clearCart()));
})