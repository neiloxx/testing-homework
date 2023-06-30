import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { initStore } from '../src/client/store';
import { CartApi, ExampleApi } from '../src/client/api';
import { Store } from 'redux';

interface ExtendedRenderOptions {
  store?: Store;
}

const basename = '/hw/store';

export function renderWithProviders(
  ui: React.ReactElement,
  {
    store = initStore(new ExampleApi(basename), new CartApi()),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return (
      <Provider store={ store }>
        <BrowserRouter>{ children }</BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}