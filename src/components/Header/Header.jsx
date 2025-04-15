import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import DetailsPopup from "../DetailsPopup/DetailsPopup";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import styles from "./Header.module.css";

import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdMovie, MdOutlineTv } from "react-icons/md";

export default function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ results: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };
  const toggleBurger = () => {
    setIsHamburgerVisible(!isHamburgerVisible);
  };

  const apiKeyReadAccess = process.env.NEXT_PUBLIC_API_KEY_READ_ACCESS;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKeyReadAccess}`,
    },
  };

  const fetchItem = async (searchTerm) => {
    console.log(`Fetching item that starts with: ${searchTerm}`);
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await res.json();
      console.log("Fetched item:", data);
      setSearchResults(data);
    } catch (error) {
      console.log("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(() => {
    const handler = setTimeout(() => {
      fetchItem(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const cleanup = debouncedFetch();
    return cleanup;
  }, [debouncedFetch]);

  console.log(searchResults.results, "Input Search results");

  const filteredResults = searchResults.results.filter(
    (result) => result.media_type !== "person"
  );
  let data;
  if (
    !loading &&
    query.trim() !== "" &&
    filteredResults.length === 0 &&
    isInputFocused
  ) {
    data = (
      <div className={styles["search-results--container"]}>
        <p className={styles["search-results--no-results"]}>
          No results found.
        </p>
      </div>
    );
  } else {
    data = filteredResults.map((result) => {
      const date =
        result.media_type === "movie"
          ? result.release_date
          : result.first_air_date;
      const year = date.split("-")[0];

      return (
        <div
          key={result.id}
          className={styles["search-results--container"]}
          onMouseDown={(e) => handleClick(result.id, result.media_type, e)}
        >
          <img
            className={styles["search-results--img"]}
            src={
              result.poster_path === null
                ? "/images/NoImage.png"
                : `https://image.tmdb.org/t/p/w92/${result.poster_path}`
            }
          />
          <p className={styles["search-results--title"]}>
            <strong>{result.title || result.name}</strong> ({year})
          </p>
          {result.media_type === "movie" ? (
            <MdMovie className={styles["mediaType-icon"]} />
          ) : (
            <MdOutlineTv className={styles["mediaType-icon"]} />
          )}
        </div>
      );
    });
  }

  // Hides search results when user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setTimeout(() => {
          setSearchResults({ results: [] });
        }, 100);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch when user clicks on search result item
  const fetchDetails = useCallback(async (id, mediaType) => {
    console.log(`Fetching details for ${mediaType} with ID: ${id}`);
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
        options
      );
      const data = await res.json();
      console.log("Fetched details:", data);
      setSelectedItem({ ...data, mediaType });
    } catch (error) {
      console.log("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const closePopup = () => {
    setSelectedItem(null);
  };

  const handleClick = useCallback(
    (id, mediaType, e) => {
      e.stopPropagation();
      console.log("Card is clicked");
      fetchDetails(id, mediaType).then(() => {
        setSearchResults({ results: [] });
      });
    },
    [fetchDetails]
  );

  return (
    <>
      <header className={styles["header"]}>
        <div className={styles["header--desktop"]}>
          <Link href="/">
            <img
              src="/images/EsdbLogo.png"
              alt="Entertainment Streaming Database logo"
              className={styles["header--logo"]}
            />
          </Link>
          <div className={styles["header--flex-right-container"]}>
            <input
              type="text"
              className={`${styles["header--searchbar"]} ${
                isSearchVisible ? styles["desktop-visible"] : ""
              }`}
              placeholder="Search for a TV Show or Movie..."
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsInputFocused(true);
                if (query.trim() !== "" && searchResults.results.length === 0) {
                  fetchItem(query);
                }
              }}
              onBlur={() => {
                setTimeout(() => setIsInputFocused(false), 100);
              }}
              ref={inputRef}
            />
            {query.trim() !== "" && isInputFocused && (
              <div
                ref={resultsRef}
                className={styles["header--search-results"]}
              >
                {data}
              </div>
            )}
            {isSearchVisible ? (
              <IoClose
                className={`${styles["header--search-btn"]} ${styles["search-btn--close"]}`}
                onClick={toggleSearch}
              />
            ) : (
              <FaSearch
                className={styles["header--search-btn"]}
                onClick={toggleSearch}
              />
            )}
            <button className={styles["header--login-btn"]}>Log In</button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={styles["header--mobile"]}>
          <div className={styles["header--mobile-inner-div"]}>
            {isHamburgerVisible ? (
              <IoClose
                className={`${styles["header--search-btn"]} ${styles["search-btn--close"]}`}
                onClick={toggleBurger}
              />
            ) : (
              <GiHamburgerMenu
                className={styles["header--mobile-hamburger"]}
                onClick={toggleBurger}
              />
            )}

            <Link href="/">
              <img
                src="/images/EsdbLogo.png"
                alt="Entertainment Streaming Database logo"
                className={styles["header--logo"]}
              />
            </Link>
            {isSearchVisible ? (
              <IoClose
                className={`${styles["header--search-btn"]} ${styles["search-btn--close"]}`}
                onClick={toggleSearch}
              />
            ) : (
              <FaSearch
                className={styles["header--search-btn"]}
                onClick={toggleSearch}
              />
            )}
          </div>
        </div>
      </header>
      <input
        type="text"
        className={`${styles["header--searchbar"]} ${
          styles["searchbar-mobile"]
        } ${isSearchVisible ? styles["mobile-visible"] : ""}`}
        placeholder="Search for a TV Show or Movie..."
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          searchResults.results.length === 0 && fetchItem(query);
        }}
        ref={inputRef}
      />
      {searchResults.results.length > 0 && (
        <div
          ref={resultsRef}
          className={`${styles["header--search-results"]} ${styles["results-mobile"]}`}
        >
          {data}
        </div>
      )}
      <nav
        className={`${styles["hamburger-nav"]} ${
          isHamburgerVisible ? styles["mobile-visible"] : ""
        }`}
      >
        <button className={styles["header--login-btn"]}>Log In</button>
      </nav>

      {/* {loading && <LoadingSpinner />} */}
      {selectedItem && (
        <DetailsPopup
          item={selectedItem}
          onClose={closePopup}
          mediaType={selectedItem.mediaType}
        />
      )}
    </>
  );
}
