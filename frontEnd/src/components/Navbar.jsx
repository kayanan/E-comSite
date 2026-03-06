import React, { useEffect, useRef, useState ,useContext } from "react";
import AppContext from "../Context/Context";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken } from "../auth/auth";
import LogoutButton from "../auth/LogoutButton";
//import SearchResults from "./SearchResults";
const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const { naveOpen,setNavOpen} = useContext(AppContext);
  const location =useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Add these new state variables
const [isNavCollapsed, setIsNavCollapsed] = useState(true);
const navbarRef = useRef(null);
  
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 3. Add this to your useEffect or as a separate useEffect
useEffect(() => {
  // Add click event listener to close navbar when clicking outside
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsNavCollapsed(true);
    }
  };
  
  // Add event listener to document when component mounts
  document.addEventListener("mousedown", handleClickOutside);
  
  // Clean up event listener on component unmount
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(()=>{
  if(location.pathname.includes("login") ||location.pathname.includes("signup")){
    setNavOpen(false)
  }
  else{
    setNavOpen(true)
  }
},[location.pathname])

  // Initial data fetch (if needed)
  const fetchInitialData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`, {
        headers: { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }
      });
      console.log(response.data, 'navbar initial data');
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

// 4. Add these new functions
// Toggle navbar collapse state
const handleNavbarToggle = () => {
  setIsNavCollapsed(!isNavCollapsed);
};

// Close navbar when a link is clicked
const handleLinkClick = () => {
  setIsNavCollapsed(true);
};

  // Update input value without searching
  const handleInputChange = (value) => {
    setInput(value);
  };

  // Only search when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (input.trim() === "") return;
    
    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);
    
    try {
      const response = await axios.get(
        `${baseUrl}/api/products/search?keyword=${input}`
      );
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        setNoResults(true);
        setShowNoProductsMessage(true);
      } else {
        // Redirect to search results page with the search data
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
      
      console.log("Search results:", response.data);
    } catch (error) {
      console.error("Error searching:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false); // Hide loader when API call finishes (success or error)
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    setIsNavCollapsed(true);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  if(!naveOpen){
    return(<></>)
  }
  
  return (
    <nav
      className="fixed top-0 w-full bg-white shadow-sm z-50"
      ref={navbarRef}
    >
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center justify-between py-3">
  
          {/* Toggle Button */}
          <button
            className="lg:hidden border rounded p-2"
            type="button"
            onClick={handleNavbarToggle}
            aria-controls="navbarSupportedContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
  
          {/* Navbar Items */}
          <div
            className={`${
              isNavCollapsed ? "hidden" : "block"
            } w-full lg:flex lg:items-center lg:justify-between`}
            id="navbarSupportedContent"
          >
            
            {/* Left Links */}
            <ul className="flex flex-col lg:flex-row lg:space-x-6 mt-3 lg:mt-0">
  
              <li>
                <a
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  href="/"
                  onClick={handleLinkClick}
                >
                  Home
                </a>
              </li>
  
              <li>
                <a
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  href="/add_product"
                  onClick={handleLinkClick}
                >
                  Add Product
                </a>
              </li>
  
              <li>
                <a
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  href="/orders"
                  onClick={handleLinkClick}
                >
                  Orders
                </a>
              </li>
  
            </ul>
  
            {/* Right Section */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mt-3 lg:mt-0">
  
              {/* Cart */}
              <a
                href="/cart"
                className="flex items-center text-gray-700 hover:text-blue-600"
                onClick={handleLinkClick}
              >
                🛒 <span className="ml-1">Cart</span>
              </a>
  
              {/* Search */}
              <form
                className="flex"
                role="search"
                onSubmit={handleSubmit}
                id="searchForm"
              >
                <input
                  className="border rounded-l px-3 py-2 outline-none"
                  type="search"
                  placeholder="Type to search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
  
                {isLoading ? (
                  <button
                    className="border border-green-600 text-green-600 px-4 rounded-r flex items-center"
                    type="button"
                    disabled
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    className="border border-green-600 text-green-600 px-4 rounded-r hover:bg-green-600 hover:text-white transition"
                    type="submit"
                  >
                    Search
                  </button>
                )}
              </form>
              {/* <SearchResults/> */}
  
              {/* No Products Alert */}
              {showNoProductsMessage && (
                <div className="absolute bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow mt-2"
                  style={{ top: "100%" }}
                >
                  No products found matching your search.
                </div>
              )}
  
            </div>
            <div className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 hover:text-white transition "><LogoutButton /></div>
  
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;