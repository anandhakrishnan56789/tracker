import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const OrderForm = ({ onOrderStatusChange }) => {
  const [orderData, setOrderData] = useState({
    orderID: '',
    status: '',
    location: '',
    deliveryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { orderID, status, location, deliveryDate } = orderData;

    if (!orderID || !status || !location || !deliveryDate) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save order details to the backend using a POST request
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      const orderStatus = response.data;
      onOrderStatusChange(orderStatus);
      setOrderData({
        orderID: '',
        status: '',
        location: '',
        deliveryDate: '',
      });
    } catch (error) {
      console.error('Error saving order details:', error);
      setError('Error saving order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter Order Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orderID"
          value={orderData.orderID}
          onChange={handleInputChange}
          placeholder="Order ID"
          required
        />
        <input
          type="text"
          name="status"
          value={orderData.status}
          onChange={handleInputChange}
          placeholder="Status"
          required
        />
        <input
          type="text"
          name="location"
          value={orderData.location}
          onChange={handleInputChange}
          placeholder="Location"
          required
        />
        <input
          type="date"
          name="deliveryDate"
          value={orderData.deliveryDate}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Order'}
        </button>
      </form>
    </div>
  );
};

OrderForm.propTypes = {
  onOrderStatusChange: PropTypes.func.isRequired,
};

export default OrderForm;
