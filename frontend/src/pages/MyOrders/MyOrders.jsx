import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';


const MyOrders = () => {

    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}})
            setData(response.data.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(token){
            fetchOrders();
        }
    },[token])

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    }

    const getStatusStep = (status) => {
        const steps = ["Food Processing", "Out for delivery", "Delivered"];
        const currentIndex = steps.indexOf(status);
        return { steps, currentIndex };
    }

  return (
    <div className='my-orders'>
       <h2>My Orders</h2>
       <div className="container">
        {data.map((order,index)=>{
            const isExpanded = expandedOrderId === order._id;
            const { steps, currentIndex } = getStatusStep(order.status);
            return(
                <div className='my-orders-order-wrapper' key={order._id || index}>
                    <div className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,idx)=>{
                            if(idx=== order.items.length-1){
                                return item.name+" x "+item.quantity
                            }else{
                                 return item.name+" x "+item.quantity+", "
                            }
                        })}</p>

                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                       <button onClick={() => toggleOrderDetails(order._id)}>
                         {isExpanded ? "Hide Details" : "Track Order"}
                       </button>
                    </div>

                    {isExpanded && (
                        <div className='order-details'>
                            {/* Status tracker */}
                            <div className='order-status-tracker'>
                                {steps.map((step, i) => (
                                    <div key={step} className={`status-step ${i <= currentIndex ? 'active' : ''} ${i === currentIndex ? 'current' : ''}`}>
                                        <div className='status-dot'>{i <= currentIndex ? '✓' : i + 1}</div>
                                        {i < steps.length - 1 && <div className={`status-line ${i < currentIndex ? 'active' : ''}`}></div>}
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className='order-details-tables'>
                                {/* Order Info Table */}
                                <div className='order-table-section'>
                                    <h4>Order Info</h4>
                                    <table className='order-table'>
                                        <tbody>
                                            <tr>
                                                <td className='label'>Order ID</td>
                                                <td>{order._id}</td>
                                            </tr>
                                            <tr>
                                                <td className='label'>Date</td>
                                                <td>{new Date(order.date).toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td className='label'>Payment</td>
                                                <td>
                                                    <span className={`payment-badge ${order.payment ? 'paid' : 'pending'}`}>
                                                        {order.payment ? '✓ Paid' : '⏳ Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='label'>Status</td>
                                                <td><span className='status-badge'>{order.status}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Delivery Address Table */}
                                {order.address && (
                                    <div className='order-table-section'>
                                        <h4>Delivery Address</h4>
                                        <table className='order-table'>
                                            <tbody>
                                                <tr>
                                                    <td className='label'>Name</td>
                                                    <td>{order.address.firstName} {order.address.lastName}</td>
                                                </tr>
                                                <tr>
                                                    <td className='label'>Street</td>
                                                    <td>{order.address.street}</td>
                                                </tr>
                                                <tr>
                                                    <td className='label'>City</td>
                                                    <td>{order.address.city}, {order.address.state} {order.address.zipcode}</td>
                                                </tr>
                                                <tr>
                                                    <td className='label'>Country</td>
                                                    <td>{order.address.country}</td>
                                                </tr>
                                                <tr>
                                                    <td className='label'>Phone</td>
                                                    <td>{order.address.phone}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Items Table */}
                            <div className='order-table-section items-section'>
                                <h4>Items Ordered</h4>
                                <table className='order-table items-table'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Item Name</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.price}</td>
                                                <td>${item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan='3'></td>
                                            <td><b>Delivery</b></td>
                                            <td><b>$2.00</b></td>
                                        </tr>
                                        <tr className='total-row'>
                                            <td colSpan='3'></td>
                                            <td><b>Total</b></td>
                                            <td><b>${order.amount}.00</b></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <button className='refresh-btn' onClick={fetchOrders} disabled={loading}>
                                {loading ? 'Refreshing...' : '↻ Refresh Status'}
                            </button>
                        </div>
                    )}
                </div>
            )
        })}
       </div>
    </div>
  )
}

export default MyOrders
