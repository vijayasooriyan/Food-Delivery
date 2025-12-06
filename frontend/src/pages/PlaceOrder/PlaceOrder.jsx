import React, { useContext } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'



const PlaceOrder = () => {

   const {getTotalCardAmount} = useContext(StoreContext);

  return (
    <form className="place-order">
        
          <div className="place-order-left">
              <p className='title'>Delevery Information</p>
              <div className="multi-fields">
                   <input type="text" placeholder='First Name'/>
                   <input type="text" placeholder='Last Name' />
              </div>
              <input type="text"  placeholder='Email address' />
              <input type="text" placeholder='Street' />
               <div className="multi-fields">
                   <input type="text" placeholder='City'/>
                   <input type="text" placeholder='State' />
              </div>
              <div className="multi-fields">
                   <input type="text" placeholder='Zip code'/>
                   <input type="text" placeholder='Country' />
              </div>
              <input type="text" placeholder='Phone' />
              
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
                      <button >PROCEED TO PAYMENT</button>
                  </div>
                </div>
          </div>
        
    </form>
  )
}

export default PlaceOrder
