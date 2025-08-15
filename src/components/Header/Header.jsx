import { useState, useEffect, useCallback, useRef } from "react";

import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore"
import { auth, db, gitHubProvider, googleProvider } from "../../../firebase/firebase";

import Link from "next/link";

import DetailsPopup from "../DetailsPopup/DetailsPopup";
import LoginModal from "../LoginModal/LoginModal"
import SignUpModal from "../SignUpModal/SignUpModal"

import styles from "./Header.module.css";

import { FaSearch, FaUserCircle, FaChevronUp, FaRegUser, FaQuestion } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineTv, MdOutlinePrivacyTip, MdOutlineContactSupport } from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { TbContract } from "react-icons/tb";

export default function Header({ user, refreshFavorites}) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ results: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isResultsFocused, setIsResultsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultRefs = useRef([]);


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

  // Fetch movie/tv show from searchbar
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

  // Debounce searchbar fetch requests
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

  
  // Displays searchbar query results
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
      <div className={styles["search-results--item"]}>
        <p className={styles["search-results--no-results"]}>
          No results found.
        </p>
      </div>
    );
  } else {
    resultRefs.current = [];
    data = filteredResults.map((result, index) => {
      const date =
        result.media_type === "movie"
          ? result.release_date
          : result.first_air_date;
      const year = date?.split("-")[0] || "N/A";
    
      const isHighlighted = index === highlightedIndex;
    
      return (
        <div
          key={result.id}
          className={`${styles["search-results--item"]} ${isHighlighted ? styles["highlighted"] : ""}`}
          onMouseDown={(e) => handleClick(result.id, result.media_type, e)}
          // onMouseEnter={() => setHighlightedIndex(index)}
          tabIndex="0"
          aria-selected={isHighlighted ? "true" : "false"}
          role="option"
          ref={(el) => (resultRefs.current[index] = el)}
        >
          <img
            className={styles["search-results--img"]}
            src={
              result.poster_path === null
                ? "/images/NoImage.png"
                : `https://image.tmdb.org/t/p/w92/${result.poster_path}`
            }
            alt={result.title || result.name}
          />
          <p className={styles["search-results--title"]}>
            <strong>{result.title || result.name}</strong> ({year})
          </p>
          {result.media_type === "movie" ? (
            <BiCameraMovie className={styles["mediaType-icon"]} />
          ) : (
            <MdOutlineTv className={styles["mediaType-icon"]} />
          )}
        </div>
      );
    });
  }

  // Scrolls search result into view with keyboard
  useEffect(() => {
    if (highlightedIndex < 0 || !resultRefs.current) return;
  
    const currentItem = resultRefs.current[highlightedIndex];
    console.log('highlightedIndex:', highlightedIndex);
    console.log('currentItem:', currentItem);
  
    if (currentItem) {
      currentItem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  // Hides search results when user clicks outside of results element
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
      e.preventDefault();
      e.stopPropagation();
      console.log("Card is clicked");
      fetchDetails(id, mediaType).then(() => {
        setSearchResults({ results: [] });
      });
    },
    [fetchDetails]
  );

  // Login & Signup
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleLogin = (email, password) => {
    console.log('Login attempt with:', email, password)
    setShowLogin(false)
  }

  const handleSignup = (username, email, password, confirmPassword) => {
    console.log('Sign up:', username, email, password, confirmPassword)
    setShowSignup(false)
  }

  // Google sign in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      const userDocRef = doc(db, "users", user.uid)

      const userSnapshot = await getDoc(userDocRef)

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          createdAt: new Date()
        })
        console.log("User document created")
      } else {
        console.log("User already exists in Firestore")
      }

      setShowLogin(false)
      setShowSignup(false)

      console.log("Signed in with user:", user)
    } catch (error) {
      console.error("Google sign in error", error)
    }
  }

  // Github sign in
  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, gitHubProvider)
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid)

      const userSnapshot = await getDoc(userDocRef)

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date()
        })
        console.log("User document created")
      } else {
        console.log("User already exists in Firestore")
      }

      setShowLogin(false)
      setShowSignup(false)

      console.log("GitHub user:", user)
    } catch (error) {
      console.error("GitHub sign in error:", error)
    }
  }

  // Track user auth state
  const [authUser, setAuthUser] = useState(null)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser);
      if (currentUser) {
        setAuthUser(currentUser)
        console.log('Fetching user data for:', currentUser.uid)
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          console.log("username:", userDoc.data().username)
          setUsername(userDoc.data().username)
        }
      } else {
        setAuthUser(null)
        setUsername(null)
        console.log('User does not exist')
      }
    })

    return () => unsubscribe();
  }, [])

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setAuthUser(currentUser);

  //     if (currentUser) {
  //       fetchUsername(currentUser.uid);
  //     } else {
  //       setUsername(null);
  //     }
  //   });

  //   async function fetchUsername(uid) {
  //     const userRef = doc(db, 'users', uid);
  //     const userDoc = await getDoc(userRef);
  //     if (userDoc.exists()) {
  //       setUsername(userDoc.data().username);
  //     }
  //   }

  //   return () => unsubscribe();
  // }, []);

  // User sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      console.log("User signed out")
      setIsHamburgerVisible(false)
    } catch (error) {
      console.log("Error signing out:", error)
    }
  }

  // Delays dropdown with setTimeout
  let dropdownTimeout = useRef(null)
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current)
    setShowDropdown(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setShowDropdown(false)
    }, 300)
  }

  // Dropdown on click for bigger tablets
  const dropdownClick = () => {
    setShowDropdown(!showDropdown)
  }

  console.log('Render state - user:', !!user, 'username:', username, 'isHamburgerVisible:', isHamburgerVisible);
  return (
    <>
      <header className={styles["header"]}>
        <div className={styles["header--container"]}>
          {isHamburgerVisible ? (
            <IoClose
              className={`${styles["header--search-btn"]} ${styles["search-btn--close"]}`}
              onClick={toggleBurger}
              aria-label="Close navigation menu"
              role="button"
            />
          ) : (
            <GiHamburgerMenu
              data-testid="open-hamburger-menu"
              className={styles["header--mobile-hamburger"]}
              onClick={() => {
                toggleBurger();
                setIsSearchVisible(false);
              }}
              aria-label="Open navigation menu"
              role="button"
            />
          )}
          <Link href="/" aria-label="Go to homepage">
            <img
              src="/images/EsdbLogo.png"
              alt="Entertainment Streaming Database logo"
              className={styles["header--logo"]}
            />
          </Link>

          {/* Search Input */}
          <div className={styles["header--search-container"]}>
            <div className={`${styles["header--searchbar-container"]} ${isSearchVisible ? styles["searchbarContainer-visible"] : ""}`}>
              <input
                type="text"
                className={`${styles["header--searchbar"]} ${isSearchVisible ? styles["searchbar-visible"] : ""}`}
                placeholder="Search for a TV Show or Movie..."
                value={query}
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
                aria-label="Search for a movie or TV show"
                aria-expanded={isSearchVisible ? "true" : "false"}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                  } else if (e.key === "Enter" && highlightedIndex >= 0) {
                    e.preventDefault();
                    const selected = filteredResults[highlightedIndex];
                    handleClick(selected.id, selected.media_type, e);
                    setHighlightedIndex(-1);
                  }
                }}
              />
            </div>

            {query.trim() !== "" && isInputFocused || isResultsFocused ? (
              <div 
                ref={resultsRef} 
                className={styles["header--search-results-container"]} 
                aria-live="polite"
                onFocus={() => setIsResultsFocused(true)}
                onBlur={() => setIsResultsFocused(false)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                {data}
              </div>
            ) : null}

            {isSearchVisible ? (
              <IoClose
                className={`${styles["header--search-btn"]} ${styles["search-btn--close"]}`}
                onClick={toggleSearch}
                aria-label="Close search"
                role="button"
              />
            ) : (
              <FaSearch
                className={styles["header--search-btn"]}
                onClick={() => {
                  toggleSearch();
                  setIsHamburgerVisible(false);
                }}
                aria-label="Open search"
                role="button"
              />
            )}

            {user ? (
              <div 
                data-testid={'profile-wrapper-desktop'}
                className={styles["header--profile-wrapper"]} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                aria-haspopup="true"
                aria-expanded={showDropdown ? "true" : "false"}
                onClick={dropdownClick}
              >
                <div className={styles["header--logged-in"]}>
                  <FaUserCircle className={styles["header--user-profile"]} />
                  <FaChevronUp className={`${styles["chevron-icon"]} ${showDropdown ? styles["rotate"] : ""}`} />
                </div>

                {showDropdown && (
                  <div className={styles["profile-dropdown"]} role="menu">
                    <div className={styles["dropdown--link-container"]}>
                      <FaRegUser className={styles["dropdown--link-icon"]}/>
                      <Link href="/account" className={styles["dropdown--link"]} role="menuitem">My Account</Link>
                    </div>
                    <div className={styles["dropdown--link-container"]}>
                      <FaQuestion className={styles["dropdown--link-icon"]}/>
                      <Link href="/faq" className={styles["dropdown--link"]} role="menuitem">FAQ</Link>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className={styles["desktop--sign-out-btn"]}
                      role="menuitem"
                      aria-label="Sign out"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                data-testid="login-button-desktop"
                className={`${styles["header--login-btn"]} ${styles["login-btn--desktop"]}`}
                onClick={() => setShowLogin(true)}
                aria-label="Login"
              >
                Login
              </button>
            )}

            <LoginModal
              data-testid="login-modal-desktop"
              closeTestId="login-modal-close-desktop"
              switchTestId="switch-to-signup-btn-desktop"
              submitLogin="submit-login-desktop"
              googleSignIn="google-signin-desktop"
              open={showLogin}
              onClose={() => setShowLogin(false)}
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleSignIn}
              onGitHubLogin={handleGitHubLogin}
              onSwitchToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              aria-labelledby="login-modal"
            />

            <SignUpModal
              data-testid="signup-modal-desktop"
              open={showSignup}
              onClose={() => setShowSignup(false)}
              onSignup={handleSignup}
              onGoogleLogin={handleGoogleSignIn}
              onGitHubLogin={handleGitHubLogin}
              onSwitchToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              aria-labelledby="signup-modal"
            />
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        className={`${styles["hamburger-nav"]} ${isHamburgerVisible ? styles["mobile-visible"] : ""}`}
        aria-label="Main menu"
      >
        {user && (
          <>
            <div className={styles["header--logged-in"]}>
              <FaUserCircle className={styles["header--user-profile"]} />
              <h2 id="username" data-testid="username-mobile" aria-live="polite">{username}</h2>
            </div>
            <hr />
          </>
        )}

        <div className={styles["mobile--links-container"]}>
          {user && (
            <div className={styles["mobile--link-container"]}>
              <FaRegUser className={styles["mobile--link-icon"]} />
              <Link href="/account" onClick={() => setIsHamburgerVisible(false)} aria-label="Go to My Account">My Account</Link>
            </div>
          )}
          <div className={styles["mobile--link-container"]}>
            <FaQuestion className={styles["mobile--link-icon"]} />
            <Link href="/faq" onClick={() => setIsHamburgerVisible(false)} aria-label="Go to FAQ">FAQ</Link>
          </div>
          <div className={styles["mobile--link-container"]}>
            <TbContract className={styles["mobile--link-icon"]} />
            <Link href="/terms" onClick={() => setIsHamburgerVisible(false)} aria-label="Go to Terms of Use">Terms of Use</Link>
          </div>
          <div className={styles["mobile--link-container"]}>
            <MdOutlinePrivacyTip className={styles["mobile--link-icon"]} />
            <Link href="/privacy" onClick={() => setIsHamburgerVisible(false)} aria-label="Go to Privacy Policy">Privacy</Link>
          </div>
          <div className={styles["mobile--link-container"]}>
            <MdOutlineContactSupport className={styles["mobile--link-icon"]} />
            <Link href="/contact" onClick={() => setIsHamburgerVisible(false)} aria-label="Go to Contact Page">Contact</Link>
          </div>
        </div>

        {/* Sign Out / Login Button */}
        {user ? (
          <button
            data-testid="signout-button-mobile"
            className={styles["mobile--sign-out-btn"]}
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            Sign Out
          </button>
        ) : (
          <button
            data-testid="login-button-mobile"
            className={styles["header--login-btn"]}
            onClick={() => setShowLogin(true)}
            aria-label="Login"
          >
            Login
          </button>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal
        data-testid="login-modal-mobile"
        closeTestId="login-modal-close-mobile"
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleSignIn}
        onGitHubLogin={handleGitHubLogin}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
        aria-labelledby="login-modal"
        aria-hidden={showLogin ? "false" : "true"}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        data-testid="signup-modal-mobile"
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSignup={handleSignup}
        onGoogleLogin={handleGoogleSignIn}
        onGitHubLogin={handleGitHubLogin}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
        aria-labelledby="signup-modal"
        aria-hidden={showSignup ? "false" : "true"}
      />

      {/* Details Popup */}
      {selectedItem && (
        <DetailsPopup
          item={selectedItem}
          onClose={closePopup}
          mediaType={selectedItem.mediaType}
          refreshFavorites={refreshFavorites}
          aria-labelledby="details-popup"
          aria-hidden={selectedItem ? "false" : "true"}
        />
      )}
    </>
  );
}
