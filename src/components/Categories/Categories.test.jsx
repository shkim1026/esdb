import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Categories from './Categories';
import '@testing-library/jest-dom';

process.env.NEXT_PUBLIC_API_KEY_READ_ACCESS = 'test-token';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('../../../firebase/firebase', () => ({
  auth: {
    currentUser: { uid: '123' },
  },
  db: {},
}));

jest.mock('@splidejs/react-splide', () => ({
  Splide: ({ children }) => <div data-testid="splide">{children}</div>,
  SplideSlide: ({ children }) => <div data-testid="splide-slide">{children}</div>,
}));


jest.mock('../Card/Card', () => (props) => (
  <div data-testid="card" onClick={props.fetchDetails}>Mock Card</div>
));

jest.mock('../DetailsPopup/DetailsPopup', () => () => (
  <div data-testid="details-popup">Mock Popup</div>
));

jest.mock('../LoadingSpinner/LoadingSpinner', () => () => (
  <div data-testid="spinner">Mock Spinner</div>
));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '1', title: 'Details' }),
  })
);

const mockFavorites = [
  {
    id: 'f1',
    title: 'Favorite Movie',
    mediaType: 'movie',
    addedAt: new Date().toISOString(),
  },
];

const mockData = {
  movies: [
    { id: '1', title: 'Movie 1', mediaType: 'movie' },
    { id: '2', title: 'Movie 2', mediaType: 'movie' },
  ],
  tv: [],
  topMovies: [],
  topTv: [],
};

const mockCategories = [
  { title: 'Trending Movies', key: 'movies', mediaType: 'movie' },
  { title: 'Trending TV Series', key: 'tv', mediaType: 'tv' },
  { title: 'Top Rated Movies', key: 'topMovies', mediaType: 'movie' },
  { title: 'Top Rated TV Series', key: 'topTv', mediaType: 'tv' },
];

describe('Categories Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', title: 'Details' }),
      })
    );
  });
  it('renders My List section if user has favorites', () => {
    render(
      <Categories
        user={{ uid: '123' }}
        favorites={mockFavorites}
        data={mockData}
        refreshFavorites={jest.fn()}
      />
    );

    expect(screen.getByText('My List')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(3); // 1 favorite + 2 movies
  });

  it('does not render My List if no user or no favorites', () => {
    render(
      <Categories
        user={null}
        favorites={[]}
        data={mockData}
        refreshFavorites={jest.fn()}
      />
    );

    expect(screen.queryByText('My List')).not.toBeInTheDocument();
  });

  it('calls fetchDetails and shows popup when a card is clicked', async () => {
    render(
      <Categories
        user={{ uid: '123' }}
        favorites={[]}
        data={mockData}
        refreshFavorites={jest.fn()}
      />
    );

    const card = screen.getAllByTestId('card')[0];
    fireEvent.click(card);

    await waitFor(() =>
      expect(screen.getByTestId('details-popup')).toBeInTheDocument()
    );
  });

  it('shows spinner when loading', async () => {
    const { container } = render(
      <Categories
        user={{ uid: '123' }}
        favorites={[]}
        data={mockData}
        refreshFavorites={jest.fn()}
      />
    );

    const card = screen.getAllByTestId('card')[0];
    fireEvent.click(card);

    expect(await screen.findByTestId('spinner')).toBeInTheDocument();
  });
});
