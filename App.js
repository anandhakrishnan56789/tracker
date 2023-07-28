import React, { useState } from 'react';
import './App.css';
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';

const App = () => {
  const [orderStatus, setOrderStatus] = useState(null);

  const handleOrderStatusChange = (status) => {
    setOrderStatus(status);
  };

  return (
    <div className="App">
      <h1>Track Order Application</h1>
      <OrderForm onOrderStatusChange={handleOrderStatusChange} />
      <hr />
      {orderStatus ? (
        <OrderStatus status={orderStatus} />
      ) : (
        <p>No order status available. Please enter an order ID to track.</p>
      )}
    </div>
  );
};

export default App;
