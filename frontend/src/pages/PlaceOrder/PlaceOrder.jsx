import React, { useContext,  useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'



const PlaceOrder = () => {

   const {getTotalCardAmount,token,food_list,cartItems,url} = useContext(StoreContext);

   const [data,setData] = useState({
     firstName:"",
     lastName:"",
     email:"",
     street:"",
     city:"",
     state:"",
     zipcode:"",
     country:"",
     phone:""
   })

const onChangeHandler = (event) =>{
     const name = event.target.name;
     const value = event.target.value;
     setData(data=>({...data,[name]:value}))
}

  const placeOrder = async (event) =>{
       event.preventDefault();
       let orderItems = [];
       
       food_list.map((item)=>{
          if(cartItems[item._id]>0) {
               let itemInfo = item;
               itemInfo["quantity"] = cartItems[item._id];
               orderItems.push(itemInfo);
          }
       })
       console.log(orderItems);
       
  }


  return (
    <form onSubmit={placeOrder} className="place-order">
        
          <div className="place-order-left">
              <p className='title'>Delevery Information</p>
              <div className="multi-fields">
                   <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name'/>
                   <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
              </div>
              <input  name='email' onChange={onChangeHandler} value={data.email} type="text"  placeholder='Email address' />
              <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
               <div className="multi-fields">
                   <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
                   <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
              </div>
              <div className="multi-fields">
                   <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code'/>
                   <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
              </div>
              <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
              
          </div>

          <div className="place-order-right">
                <div className="card-total">
                  <h2>Card Totals</h2>
                  <div>
                      <div className="card-total-details">
                          <p>Subtotal</p>
                          <p>$ {getTotalCardAmount()}</p>
                      </div>
                      <hr/>
                      <div className="card-total-details">
                           <p>Delevery Fee</p>
                           <p>$ {getTotalCardAmount()===0?0:2}</p>
                      </div>
                      <hr/>
                      <div className="card-total-details">
                           <p>Total</p>
                           <p>$ {getTotalCardAmount()===0?0:getTotalCardAmount()+2}</p>
                      </div>
                      <button type='submit' >PROCEED TO PAYMENT</button>
                  </div>
                </div>
          </div>
        
    </form>
  )
}

export default PlaceOrder
