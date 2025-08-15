import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EpisodeSelect from "./EpisodeSelect";

// Mock styles
jest.mock("./EpisodeSelect.module.css", () => new Proxy({}, { get: (target, prop) => prop }));

// Mock EmbedVideoModal
jest.mock("../EmbedVideoModal/EmbedVideoModal", () => ({ url, title }) => (
  <div data-testid="embed-video" data-url={url} data-title={title} />
));

const mockSeasons = [
  {
    id: 100,
    season_number: 0,
    episode_count: 1,
  },
  {
    id: 101,
    season_number: 1,
    episode_count: 3,
  },
  {
    id: 102,
    season_number: 2,
    episode_count: 2,
  },
];

describe("EpisodeSelect", () => {
  it("renders season and episode selectors", () => {
    render(<EpisodeSelect seasons={mockSeasons} showId={1234} title="Test Show" />);

    expect(screen.getByLabelText(/Select Season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Episode/i)).toBeInTheDocument();
  });

  it("renders episodes for the first non-zero season by default", () => {
    render(<EpisodeSelect seasons={mockSeasons} showId={1234} title="Test Show" />);

    const episodeSelect = screen.getByLabelText(/Select Episode/i);
    const episodeOptions = Array.from(episodeSelect.querySelectorAll("option"));
    expect(episodeOptions.map((opt) => opt.textContent)).toEqual(["1", "2", "3"]);

  });

  it("updates episode list when a different season is selected", () => {
    render(<EpisodeSelect seasons={mockSeasons} showId={1234} title="Test Show" />);

    const seasonSelect = screen.getByLabelText(/Select Season/i);
    fireEvent.change(seasonSelect, { target: { value: "2" } });

    const episodeSelect = screen.getByLabelText(/Select Episode/i);
    const updatedEpisodeOptions = Array.from(episodeSelect.querySelectorAll("option"));
    expect(updatedEpisodeOptions.map((opt) => opt.textContent)).toEqual(["1", "2"]);
  });

  it("passes correct URL and title to EmbedVideoModal", () => {
    render(<EpisodeSelect seasons={mockSeasons} showId={1234} title="Test Show" />);

    const embed = screen.getByTestId("embed-video");

    expect(embed).toHaveAttribute(
      "data-url",
      "https://vidsrc.xyz/embed/tv?tmdb=1234&season=1&episode=1&ds_lang=en"
    );
    expect(embed).toHaveAttribute("data-title", "Test Show");
  });

  it("updates URL when episode is changed", () => {
    render(<EpisodeSelect seasons={mockSeasons} showId={1234} title="Test Show" />);

    const episodeSelect = screen.getByLabelText(/Select Episode/i);
    fireEvent.change(episodeSelect, { target: { value: "3" } });

    const embed = screen.getByTestId("embed-video");
    expect(embed).toHaveAttribute(
      "data-url",
      "https://vidsrc.xyz/embed/tv?tmdb=1234&season=1&episode=3&ds_lang=en"
    );
  });
});
