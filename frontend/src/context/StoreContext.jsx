import axios from "axios";
import { createContext, useContext, useEffect } from "react";

import { useState } from "react";



export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cardItems, setCardItems] = useState({});

    const url = "http://localhost:4000" ;
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);

    const addToCard = async (itemId) => {
        if (!cardItems[itemId]) {
            setCardItems(prev => ({ ...prev, [itemId]: 1 }))
        } else {
            setCardItems(prev => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCard = async (itemId) => {
        setCardItems(prev => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    
    }

    const getTotalCardAmount = () => {
        let totalAmount = 0;
        for (const item in cardItems) {

            if (cardItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cardItems[item];
            }


        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }
    

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCardItems(response.data.cartdata);
    } 

    useEffect(()=>{
        
        async function loadData () {
            await fetchFoodList();
            if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
            await loadCartData(localStorage.getItem("token"));
        }
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cardItems,
        setCardItems,
        addToCard,
        removeFromCard,
        getTotalCardAmount,
        url,
        token,
        setToken
    }



    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;