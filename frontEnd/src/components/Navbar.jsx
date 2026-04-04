import React, { useEffect, useRef, useState, useContext } from "react";
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
  const { naveOpen, setNavOpen } = useContext(AppContext);
  const location = useLocation();
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

  useEffect(() => {
    if (location.pathname.includes("login") || location.pathname.includes("signup")) {
      setNavOpen(false)
    }
    else {
      setNavOpen(true)
    }
  }, [location.pathname])

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

  if (!naveOpen) {
    return (<></>)
  }

  return (<nav
  className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50"
  ref={navbarRef}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div
        className="text-xl sm:text-2xl font-bold text-blue-600 cursor-pointer shrink-0"
        onClick={() => navigate("/")}
      >
        MyStore
      </div>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        onClick={handleNavbarToggle}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Desktop Nav */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full lg:ml-8">
        {/* Links */}
        <ul className="flex items-center gap-6">
          <li>
            <a
              href="/"
              onClick={handleLinkClick}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/add_product"
              onClick={handleLinkClick}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Add Product
            </a>
          </li>

          <li>
            <a
              href="/orders"
              onClick={handleLinkClick}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Orders
            </a>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              className="w-56 border border-gray-300 px-4 py-2 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search products..."
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "..." : "Search"}
            </button>
          </form>

          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition text-gray-700"
          >
            <span>🛒</span>
            <span className="text-sm font-medium">Cart</span>
          </button>

          <div className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-500 hover:text-white transition">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Nav */}
    {!isNavCollapsed && (
      <div className="lg:hidden pb-4">
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Links */}
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="/"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="/add_product"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                Add Product
              </a>
            </li>

            <li>
              <a
                href="/orders"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
              >
                Orders
              </a>
            </li>
          </ul>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              className="w-full border border-gray-300 px-4 py-2 rounded-xl sm:rounded-l-xl sm:rounded-r-none outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search products..."
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-xl sm:rounded-l-none sm:rounded-r-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "..." : "Search"}
            </button>
          </form>

          {/* Cart + Logout */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                handleLinkClick();
                navigate("/cart");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700"
            >
              <span>🛒</span>
              <span className="text-sm font-medium">Cart</span>
            </button>

            <div className="w-full px-4 py-2 rounded-xl bg-gray-100 hover:bg-red-500 hover:text-white transition text-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* No Results Alert */}
  {showNoProductsMessage && (
    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[90%] max-w-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow text-center">
      No products found
    </div>
  )}
</nav>)
};

export default Navbar;

