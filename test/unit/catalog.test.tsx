import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { renderWithProviders } from '../test-utils';
import { Catalog } from '../../src/client/pages/Catalog';
import axios, { AxiosResponse } from 'axios';
import { ProductShortInfo } from '../../src/common/types';
import { ProductDetails } from '../../src/client/components/ProductDetails';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import userEvent from '@testing-library/user-event';
import { createStore } from 'redux';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('Каталог', () => {
  const products: ProductShortInfo[] = [
    { id: 0, name: 'test-name-1', price: 1000 },
    { id: 1, name: 'test-name-2', price: 2000, } ];

  const product = {
    id: 0,
    name: 'test-name-1',
    price: 1000,
    description: 'Pretty',
    material: 'Fresh',
    color: 'Blue',
  }

  const mockedGetProducts: AxiosResponse<ProductShortInfo[]> = {
    data: products,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  const initState = {
    cart: {
      0: { id: 0, name: 'test-name-1', price: 1000, count: 3 },
      1: { id: 1, name: 'test-name-2', price: 2000, count: 1 },
    },
    products: [
      { id: 0, name: 'test-name-1', price: 1000 },
      { id: 1, name: 'test-name-2', price: 2000 },
    ]
  }

  it('В каталоге должны отображаться товары, список которых приходит с сервера', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockedGetProducts);
    const { container } = renderWithProviders(<Catalog />);
    await waitFor(() => {
      expect(container.querySelectorAll('.ProductItem').length).toBe(products.length);
    });
  });


  it('Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockedGetProducts);
    const { container } = renderWithProviders(<Catalog />);
    await waitFor(() => {
      for (let product of products) {
        expect(screen.getByText(product.name, { selector: 'h5' }));
        expect(screen.getByText(`$${ product.price }`, { selector: 'p' }));
        expect(container.querySelector('.ProductItem').querySelector('.card-link')).toBeInTheDocument();
      }
    });
  });

  it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину', () => {
    renderWithProviders(<ProductDetails product={ product } />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(`$${ product.price }`)).toBeInTheDocument();
    expect(screen.getByText(product.color)).toBeInTheDocument();
    expect(screen.getByText(product.material)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('На странице с подробным описанием не меняется верстка', () => {
    const wrapper = renderWithProviders(<ProductDetails product={ product } />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
    const user = userEvent;
    const mockedCartApi = new CartApi();
    const state = {
      [product.id]: {
        name: product.name,
        price: product.price,
        count: 0,
      },
    }
    mockedCartApi.getState = () => (state);

    const store = initStore(new ExampleApi(''), mockedCartApi);

    renderWithProviders(<ProductDetails
      product={ product } />, { store: store });

    const button = screen.getByRole('button', { name: 'Add to Cart' });

    expect(mockedCartApi.getState()[product.id].count).toBe(0);
    await user.click(button);
    expect(store.getState().cart[product.id].count).toBe(1);
    await user.click(button);
    expect(store.getState().cart[product.id].count).toBe(2);
  });

  it('Если товар уже добавлен в корзину на странице товара должно отображаться сообщение об этом', async () => {
    const user = userEvent;
    const store = createStore(() => initState);
    renderWithProviders(<ProductDetails product={ product } />, { store: store });
    expect(screen.getByText('Item in cart')).toBeInTheDocument();
  });

  it('Если товар уже добавлен в корзину на странице каталога должно отображаться сообщение об этом', async () => {
    const store = createStore(() => initState);
    renderWithProviders(<Catalog />, { store: store });
    expect(screen.getAllByText('Item in cart').length).toBe(Object.keys(initState.cart).length);
  });
})
;
