import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the ThemeContext since we don't need to test its functionality here
jest.mock('../context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>
}));

// Mock the router since we don't need to test routing here
jest.mock('../routes/Router', () => ({
  __esModule: true,
  default: () => [{
    path: '/',
    element: <div data-testid="mock-route">Mock Route</div>
  }]
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });

  test('renders ThemeProvider', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();
  });

  test('renders routing content', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const routeContent = screen.getByTestId('mock-route');
    expect(routeContent).toBeInTheDocument();
  });
}); 