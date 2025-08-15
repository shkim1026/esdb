import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailsPopup from "./DetailsPopup";
import { BsCheckCircle, BsPlusCircle } from "react-icons/bs";

// Mock styles import
jest.mock(
  "./DetailsPopup.module.css",
  () =>
    new Proxy(
      {},
      {
        get: (target, prop) => prop,
      }
    )
);

// Mock child components
jest.mock("../EpisodeSelect/EpisodeSelect", () => () => <div data-testid="episode-select" />);
jest.mock("../EmbedVideoModal/EmbedVideoModal", () => ({ url, title }) => (
  <div data-testid="embed-video" />
));

// Mock the useFavorites hook
import useFavorites from "../../hooks/useFavorites";
jest.mock("../../hooks/useFavorites", () => ({
    __esModule: true,
    default: jest.fn(),
}));

beforeEach(() => {
  useFavorites.mockReturnValue({
    isFavorite: false,
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  });
});

describe("DetailsPopup", () => {
  const mockOnClose = jest.fn();
  const mockRefreshFavorites = jest.fn();

  const baseItem = {
    id: 1,
    title: "Sample Movie",
    name: "Sample Movie",
    original_title: "Original Title",
    original_name: "Original Name",
    release_date: "2022-01-01",
    first_air_date: "2022-01-01",
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Drama" },
    ],
    runtime: 120,
    tagline: "This is a sample tagline.",
    overview: "This is an overview.",
    vote_average: 7.8,
    backdrop_path: "/backdrop.jpg",
    poster_path: "/poster.jpg",
    seasons: [{ season_number: 1 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  });

  it("renders movie details correctly", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Sample Movie/i)).toBeInTheDocument();
    expect(screen.getByText(/Original Name/i)).toBeInTheDocument();
    expect(screen.getByText(/2022-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Action, Drama/i)).toBeInTheDocument();
    expect(screen.getByText(/2h 0m/i)).toBeInTheDocument();
    expect(screen.getByText(/"This is a sample tagline."/)).toBeInTheDocument();
    expect(screen.getByText(/This is an overview./)).toBeInTheDocument();
    expect(screen.getByText(/7.8\/10/)).toBeInTheDocument();
    expect(screen.getByText(/Add to My List/)).toBeInTheDocument();
    expect(screen.getByTestId("embed-video")).toBeInTheDocument();
  });

  it("handles closing the popup via background click", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles closing the popup via close button", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    fireEvent.click(screen.getByLabelText(/close/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("toggles favorite button", () => {
    const mockAdd = jest.fn();
    const mockRemove = jest.fn();

    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: mockAdd,
      removeFromFavorites: mockRemove,
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    const button = screen.getByLabelText(/Add to My List/i);
    fireEvent.click(button);

    expect(mockAdd).toHaveBeenCalledWith(baseItem, "movie");
    expect(mockRefreshFavorites).toHaveBeenCalled();
  });

  it("renders EpisodeSelect if mediaType is tv", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="tv"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    expect(screen.getByTestId("episode-select")).toBeInTheDocument();
  });

  it("returns null when item is null", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    render(
      <DetailsPopup
        item={null}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );
    
    screen.debug();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds and removes no-scroll class on mount and unmount", () => {
    useFavorites.mockReturnValue({
      isFavorite: false,
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    const { unmount } = render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    expect(document.body.classList.contains("no-scroll")).toBe(true);
    expect(document.documentElement.classList.contains("no-scroll")).toBe(true);

    unmount();

    expect(document.body.classList.contains("no-scroll")).toBe(false);
    expect(document.documentElement.classList.contains("no-scroll")).toBe(
      false
    );
  });

  it("removes item from favorites if already a favorite", () => {
    const mockRemove = jest.fn();

    useFavorites.mockReturnValue({
      isFavorite: true,
      addToFavorites: jest.fn(),
      removeFromFavorites: mockRemove,
    });

    render(
      <DetailsPopup
        item={baseItem}
        onClose={mockOnClose}
        mediaType="movie"
        refreshFavorites={mockRefreshFavorites}
      />
    );

    const button = screen.getByLabelText(/Remove from My List/i);
    fireEvent.click(button);

    expect(mockRemove).toHaveBeenCalled();
    expect(mockRefreshFavorites).toHaveBeenCalled();
  });
});
