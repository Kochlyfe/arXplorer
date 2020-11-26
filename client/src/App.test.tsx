/* eslint-disable no-undef */
import {
  getByTestId,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import App from './App';

import { createMemoryHistory } from 'history';

import React from 'react';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import { fetchGraphDataMock } from './mocks/fetchGraphDataMock';

let history;
beforeEach(() => {
  history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
});

test('displays front page title', () => {
  const headingElement = screen.getByText('Ready to arXplore?');
  expect(headingElement).toBeInTheDocument();
  expect(screen.getByTestId('tiny-search-bar')).toBeInTheDocument();
});

test('loads search page upon click', async () => {
  fireEvent.click(screen.getByText('Search'));
  // Wait for page to update with query text
  const author = await screen.getByLabelText('Author');
  const title = await screen.getByLabelText('Title');
  const journal = await screen.getByLabelText('Journal');
  const abstract = await screen.getByLabelText('Abstract');
  expect(author).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(journal).toBeInTheDocument();
  expect(abstract).toBeInTheDocument();
  const items = await screen.findAllByText('Author');
  expect(items).toHaveLength(1);
});

test('searches correctly', async () => {

  const data = fetchGraphDataMock;
  const mockFn = jest.fn().mockResolvedValue(data);

  //mocking module
  jest.mock('./services/ApiClient', () => {
    return {
      __esModule: true,
      fetchGraphData: mockFn,
    };
  });

  const searchInput = screen.getByPlaceholderText('Search for author...');
  const button = screen.getByText('Quicksearch');

  fireEvent.change(searchInput, { target: { value: 'Trump' } });
  fireEvent.click(button);

  waitFor(document.querySelector('circle'), () => {
    const circle = document.querySelector('circle');
    expect(history.location.pathname).toBe('/graph');
    const listbutton = screen.getByTestId('listbutton');
    fireEvent.click(circle);
    expect(screen.getByTestId('article-div0')).toBeInTheDocument();
    fireEvent.click(listbutton);
    expect(history.location.pathname).toBe('/list');
    screen.getByText('Total # of articles: 25');
  });
});
