import { useState, useEffect, useCallback, useRef } from 'react'
import DetailsPopup from './DetailsPopup'
import LoadingSpinner from './LoadingSpinner'

import logo from '../assets/EsdbLogo.png'
import noImage from '../assets/NoImage.png'

import { FaSearch  } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { GiHamburgerMenu } from "react-icons/gi";
import { MdMovie, MdOutlineTv } from 'react-icons/md'

export default function Header() {

    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [isHamburgerVisible, setIsHamburgerVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState({ results: [] })
    const [selectedItem, setSelectedItem] = useState(null)

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible)
    }
    const toggleBurger = () => {
        setIsHamburgerVisible(!isHamburgerVisible)
    }

    const apiKeyReadAccess = import.meta.env.VITE_API_KEY_READ_ACCESS;
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKeyReadAccess}`
        }
    }

    const fetchItem = async (searchTerm) => {
        console.log(`Fetching item that starts with: ${searchTerm}`);
        if (loading) return;
        setLoading(true)
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`, options)
            const data = await res.json()
            console.log("Fetched item:", data);
            setSearchResults(data)
        } catch (error) {
            console.log("Error fetching details:", error)
        } finally {
            setLoading(false)
        }
    }

    const debouncedFetch = useCallback(() => {
        const handler = setTimeout(() => {
            fetchItem(query)
        }, 500)
        return () => clearTimeout(handler)
    }, [query])

    useEffect(()=> {
        const cleanup = debouncedFetch()
        return cleanup
    }, [debouncedFetch])

    console.log(searchResults.results, "Input Search results")

    const data = searchResults.results.map((result) => {
        if (result.media_type === 'person') return null

        const date = result.media_type === 'movie' ? result.release_date : result.first_air_date
        const year = date.split("-")[0]

        if (result.media_type === "tv") {
            return (
                <div key={result.id} className="search-results--container" onMouseDown={(e) => handleClick(result.id, result.media_type, e)}>
                    <img src={result.poster_path === null ? noImage : `https://image.tmdb.org/t/p/w92/${result.poster_path}`} />
                    <p><strong>{result.name}</strong> ({year})</p>
                    <MdOutlineTv className="mediaType-icon"/>
                </div>
            )
        } 
        if (result.media_type === "movie") {
            return (
                <div key={result.id} className="search-results--container" onMouseDown={(e) => handleClick(result.id, result.media_type, e)}>
                    <img src={result.poster_path === null ? noImage : `https://image.tmdb.org/t/p/w92/${result.poster_path}`} />
                    <p><strong>{result.title}</strong> ({year})</p>
                    <MdMovie className="mediaType-icon"/>
                </div>
            )
        } else {
            return null
        }
    })

    // Hides search results when user clicks outside
    const inputRef = useRef(null)
    const resultsRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setSearchResults({ results: [] })
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Fetch when user clicks on search result item
    const fetchDetails = useCallback(async (id, mediaType) => {
        console.log(`Fetching details for ${mediaType} with ID: ${id}`);
        if (loading) return;
        setLoading(true)
        try {
          const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`, options)
          const data = await res.json()
          console.log("Fetched details:", data);
          setSelectedItem({...data, mediaType});
        } catch (error) {
          console.log("Error fetching details:", error)
        } finally {
          setLoading(false)
        }
      },[])
    
      const closePopup = () => {
        setSelectedItem(null)
      }
    
      const handleClick = useCallback((id, mediaType, e) => {
        e.stopPropagation();
        console.log("Card is clicked");
        fetchDetails(id, mediaType)
      }, [fetchDetails]);

    return (
        <>
            <header>
                <div className="header--full">
                    <a href="#">
                        <img src={logo} alt="Entertainment Streaming Database logo" className="header--logo"/>
                    </a>
                    <div className="header--flex-right-container">
                        <input 
                            type="text" 
                            className={`header--searchbar ${isSearchVisible ? 'visible' : ''}`}
                            placeholder="Search for a TV Show or Movie..." 
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => { searchResults.results.length === 0 && fetchItem(query)}}
                            ref={inputRef}
                        />
                        {searchResults.results.length > 0 && 
                            <div ref={resultsRef} className="header--search-results">
                                {data}
                            </div>
                        }
                        { isSearchVisible
                            ? <IoClose  className="header--search-btn search-btn--close" onClick={toggleSearch} />
                            : <FaSearch className="header--search-btn" onClick={toggleSearch} />
                        }
                        <button className="header--login-btn">Log In</button>
                    </div>
                </div>
                <div className="header--mobile">
                    <div className="header--mobile-inner-div">
                        { isHamburgerVisible 
                            ? <IoClose className="header--search-btn search-btn--close" onClick={toggleBurger} />
                            : <GiHamburgerMenu className="header--mobile-hamburger" onClick={toggleBurger}/>
                        }
                        
                        <a href="#">
                            <img src={logo} alt="Entertainment Streaming Database logo" className="header--logo"/>
                        </a>
                        { isSearchVisible
                            ? <IoClose  className="header--search-btn search-btn--close" onClick={toggleSearch} />
                            : <FaSearch className="header--search-btn" onClick={toggleSearch} />
                        }
                    </div>
                </div>
            </header>
            <input 
                type="text" 
                className={`header--searchbar searchbar-mobile ${isSearchVisible ? 'visible' : ''}`}
                placeholder="Search for a TV Show or Movie..." 
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { searchResults.results.length === 0 && fetchItem(query)}}
                ref={inputRef}
            />
            {searchResults.results.length > 0 && 
                <div ref={resultsRef} className="header--search-results results-mobile">
                    {data}
                </div>
            }
            <nav className={`hamburger-nav ${isHamburgerVisible ? 'visible' : ''}`}>
                <button className="header--login-btn">Log In</button>
            </nav>

            {loading && <LoadingSpinner />}
            {selectedItem && <DetailsPopup item={selectedItem} onClose={closePopup} mediaType={selectedItem.mediaType}/>}
        </>
    )
}