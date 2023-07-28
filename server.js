const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const orderSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  deliveryDate: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.post('/api/orders', async (req, res, next) => {
  try {
    const { orderID, status, location, deliveryDate } = req.body;

    // Validate input data (you can use express-validator for more complex validation)
    if (!orderID || !status || !location || !deliveryDate) {
      return res.status(400).json({ error: 'Invalid order details' });
    }

    const order = new Order({
      orderID,
      status,
      location,
      deliveryDate,
    });

    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    console.error('Error saving order details:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

app.get('/api/order-status/:orderID', async (req, res, next) => {
  try {
    const { orderID } = req.params;

    const order = await Order.findOne({ orderID });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order status:', error);
    next(error); // Pass the error to the error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
