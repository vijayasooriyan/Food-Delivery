import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
    };

    const addToCart = async (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (err) {
                if (err.response?.status === 401) logout();
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 0) }));
        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (err) {
                if (err.response?.status === 401) logout();
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = food_list.find(product => product._id === itemId);
                if (itemInfo) { // ✅ check if item exists
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data || []);
        } catch (err) {
            console.error("Failed to fetch food list:", err);
        }
    };

    const loadCartData = async (savedToken) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: savedToken } });
            setCartItems(response.data.cartdata || {});
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                setToken("");
            }
            console.error("Failed to load cart data:", err);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const res = await axios.post(url + "/api/cart/get", {}, { headers: { token: storedToken } });
                    setToken(storedToken);
                    setCartItems(res.data.cartdata || {});
                } catch (err) {
                    console.warn("Token invalid, clearing.");
                    localStorage.removeItem("token");
                    setToken("");
                }
            }
        }
        loadData();
    }, []);

    return (
        <StoreContext.Provider value={{
            food_list,
            cartItems,
            setCartItems,
            addToCart,
            removeFromCart,
            getTotalCartAmount,
            url,
            token,
            setToken,
            logout,
            searchQuery,
            setSearchQuery,
            darkMode,
            toggleDarkMode
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
