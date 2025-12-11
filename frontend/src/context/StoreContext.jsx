import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({}); // ✅ initialized to empty object
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const url = "http://localhost:4000";

    const addToCart = async (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 0) }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
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

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartdata || {});
        } catch (err) {
            console.error("Failed to load cart data:", err);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
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
            setToken
        }}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
