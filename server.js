// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Define a schema for the products
const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  date_added: { type: Date, required: true }
});

// Create a model from the schema
const Product = mongoose.model('Product', productSchema);

// API endpoint to add a product (POST)
app.post('/api/products', async (req, res) => {
  const { product_code, name, description, price, qty, date_added } = req.body;

  const newProduct = new Product({
    product_code,
    name,
    description,
    price,
    qty,
    date_added
  });

  try {
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// API endpoint to get all products (GET)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

// API endpoint to update a product (PUT)
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { product_code, name, description, price, qty, date_added } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, {
      product_code,
      name,
      description,
      price,
      qty,
      date_added
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// API endpoint to delete a product (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  app.get('/', (req, res) => {
    res.send('Welcome to the Product API');
  });
});
