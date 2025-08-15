import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/',
  })),
}));

describe('Footer component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renders the logo with alt text', () => {
    const logo = screen.getByAltText(/entertainment streaming database logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/EsdbLogo.png');
  });

  test('renders all navigation links', () => {
    expect(screen.getByRole('link', { name: /faq/i })).toHaveAttribute('href', '/faq');
    expect(screen.getByRole('link', { name: /terms of use/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
  });

  test('renders the disclaimer paragraph', () => {
    expect(screen.getByText(/This website is a personal project created solely for the purpose/i)).toBeInTheDocument();
  });

  test('renders the hosting disclaimer', () => {
    expect(screen.getByText(/No files are hosted on this website's servers/i)).toBeInTheDocument();
  });

  test('renders the copyright', () => {
    expect(screen.getByText(/© 2025 Entertainment Streaming Database/i)).toBeInTheDocument();
  });
});
