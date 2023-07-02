import React from 'react';
import { renderWithProviders } from '../test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Application } from '../../src/client/Application';
import { createStore } from 'redux';
import { Cart } from '../../src/client/pages/Cart';
import userEvent from '@testing-library/user-event';
import { addToCart, checkout, checkoutComplete, clearCart, initStore } from '../../src/client/store';
import { CartApi, ExampleApi } from '../../src/client/api';
import axios, { AxiosResponse } from 'axios';
import { CheckoutFormData, CheckoutResponse, ProductShortInfo } from '../../src/common/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Форма при совершении покупки', () => {
  const initState = {
    cart: {
      0: { id: 0, name: 'test-name-1', price: 1000, count: 3 },
      1: { id: 1, name: 'test-name-2', price: 2000, count: 1 },
    },
    products: [
      { id: 0, name: 'test-name-1', price: 1000 },
      { id: 1, name: 'test-name-2', price: 2000 },
    ],
    latestOrderId: 0,
  };

  const product = {
    id: 0,
    name: 'test-name-1',
    price: 1000,
    description: 'Pretty',
    material: 'Fresh',
    color: 'Blue',
  }

  const store = createStore(() => initState);
  const mockedPostCheckout: AxiosResponse<CheckoutResponse> = {
    data: { id: 1 },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  it('Форма должна отображаться на странице, если в корзине есть элементы', () => {
    const { container } = renderWithProviders(<Cart />, { store: store });
    expect(container.querySelector('.Form')).toBeInTheDocument();
  });

  it('Форма должна валидироваться при нажатии на кнопку "Checkout"', async () => {
    const user = userEvent;
    const { container } = renderWithProviders(<Cart />, { store: store });
    const checkoutButton = screen.getByRole('button', { name: 'Checkout' });

    const fields = {
      name: screen.getByLabelText('Name'),
      phone: screen.getByLabelText('Phone'),
      address: screen.getByLabelText('Address'),
    }
    Object.values(fields).forEach(field => expect(field.className).not.toContain('is-invalid'));
    await user.click(checkoutButton);
    Object.values(fields).forEach(field => expect(field.className).toContain('is-invalid'));
  });

  it('После успешного заполнения формы появляется сообщение', async () => {
    mockedAxios.post.mockResolvedValueOnce(mockedPostCheckout);
    const store = initStore(new ExampleApi('/hw/store'), new CartApi());
    const { container } = renderWithProviders(<Cart />, { store: store });
    const form = {
      name: 'TestName',
      phone: '8999999999',
      address: 'TestAddress',
    }
    const cart = {
      0: { id: 0, name: 'test-name-1', price: 1000, count: 3 },
      1: { id: 1, name: 'test-name-2', price: 2000, count: 1 },
    }

    store.dispatch(checkout(form, cart));
    await waitFor(() => {
        expect(container.querySelector('.Cart-SuccessMessage')).toBeInTheDocument();
      }
    )

  });

  it('Поля формы должны быть валидны при введении валидных данных', async () => {
    const user = userEvent;
    renderWithProviders(<Cart />, { store: store });
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });

    const fields = {
      name: screen.getByLabelText('Name') as HTMLInputElement,
      phone: screen.getByLabelText('Phone') as HTMLInputElement,
      address: screen.getByLabelText('Address') as HTMLTextAreaElement,
    }

    fireEvent.change(fields.name, { target: { value: 'Test Name' } });
    fireEvent.change(fields.phone, { target: { value: '8999999999' } });
    fireEvent.change(fields.address, { target: { value: 'Test Address' } });

    await user.click(checkoutButton);

    expect(fields.name.classList).not.toContain('is-invalid');
    expect(fields.phone.classList).not.toContain('is-invalid');
    expect(fields.address.value).not.toContain('is-invalid');
  });

  it('После отправки формы должно появляться сообщение об успехе', async () => {
    mockedAxios.post.mockResolvedValueOnce(mockedPostCheckout);

    const store = initStore(new ExampleApi(''), new CartApi());
    const { container } = renderWithProviders(<Cart />, { store: store });
    store.dispatch(addToCart(product));
    store.dispatch(checkoutComplete(1));

    expect(container.querySelector('.alert-success')).toBeInTheDocument();
  });

  afterEach(() => store.dispatch(clearCart()))
})