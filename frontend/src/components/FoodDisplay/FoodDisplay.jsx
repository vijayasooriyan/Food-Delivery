import React from 'react'
import './FoodDisplay.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext' 
import FoodItem from '../FoodItem/FoodItem'  

const FoodDisplay = ({category}) => {

    const {food_list, searchQuery} = useContext(StoreContext);

    const filteredList = food_list.filter((item) => {
        const matchesCategory = category === "All" || category === item.category;
        const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

  return (
    <div className='food-display' id='food-display'>
    <h2>{searchQuery ? `Results for "${searchQuery}"` : 'Top dishes near you'}</h2>
    <div className="food-display-list">
      {filteredList.length > 0 ? filteredList.map((item, index) => {
              return <FoodItem key={index} id={item._id} name={item.name}
         description={item.description} price={item.price} image={item.image} />
      }) : <p className='no-results'>No food items found.</p>}
    </div>
    </div>
  )
}

export default FoodDisplay
