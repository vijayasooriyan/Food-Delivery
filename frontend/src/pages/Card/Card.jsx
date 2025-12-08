import React, { useContext } from 'react'
import './Card.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Card = () => {

  const { cardItems, food_list, removeFromCard,getTotalCardAmount,url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='card'>
      <div className="card-items">
        <div className="card-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>

        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cardItems[item._id] > 0) {
            return (
              <div>
                <div className='card-items-title card-items-item'>
                  <img src={url+"/images/"+item.image} alt='' />
                  <p>{item.name}</p>
                  <p>$ {item.price}</p>
                  <p>{cardItems[item._id]}</p>
                  <p>$ {item.price * cardItems[item._id]}</p>
                  <p onClick={()=>removeFromCard(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>



            )
          }
        })}
      </div>
          <div className="card-bottom">
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
                      <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
                  </div>
                </div>

                  <div className="card-promocode">
                       <div>
                           <p>If you have promocode , Enter it here</p>
                           <div className="card-promocode-input">
                                <input type="text" placeholder='promo code' />
                                <button>Submit</button>
                           </div>
                       </div>
                  </div>
              
              
          </div>
    </div>
  )
}

export default Card
