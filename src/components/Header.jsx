import { useState } from 'react'
import logo from '../assets/EsdbLogo.png'
import { FaSearch  } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header() {

    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [isHamburgerVisible, setIsHamburgerVisible] = useState(false)

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible)
    }
    const toggleBurger = () => {
        setIsHamburgerVisible(!isHamburgerVisible)
    }
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
                        />
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
            />
            <nav className={`hamburger-nav ${isHamburgerVisible ? 'visible' : ''}`}>

            </nav>
        </>
    )
}