require('dotenv').config();

const express = require('express');
const authenticateUser = require('../src/middleware/authenticateUser')
// const jwt = require('jsonwebtoken');

//import routes
const accounRoutes = require('../src/routes/account');
const itemRoutes = require('../src/routes/item');
const cartRoutes = require('../src/routes/cart');
const orderRoutes = require('../src/routes/order');

//Import model 
const Account = require('../src/models/account'); // Import Account model
const Item = require('../src/models/item'); // Import Item model
const Cart = require('../src/models/cart'); // Import Cart model
const CartItem = require('../src/models/cart-item'); // Import Cart Item model
const Order = require('../src/models/order'); // Import Order model
const OrderItem = require('../src/models/order-item'); // Import Cart model

const app = express();

Account.hasMany(Cart, {
    foreignKey: 'accountId',     
    as: 'carts'              
  });
  
  Cart.belongsTo(Account, {
    foreignKey: 'accountId',     
    as: 'account'                
  });
  
  Item.hasMany(CartItem, {
    foreignKey: 'itemId',     
    as: 'cart-items'               
  });
  
  CartItem.belongsTo(Item, {
    foreignKey: 'itemId',     
    as: 'item'                
  });
  
  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',     
    as: 'cart-items'              
  });
  
  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',   
    as: 'cart'               
  });
  
  Account.hasMany(Order, {
    foreignKey: 'accountId',    
    as: 'orders'           
  });
  
  Order.belongsTo(Account, {
    foreignKey: 'accountId',     
    as: 'account'               
  });
  
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',     
    as: 'order-items'               
  });
  
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',     
    as: 'order'                
  });
  
  Item.hasMany(OrderItem, {
    foreignKey: 'itemId',     
    as: 'order-items'              
  });
  
  OrderItem.belongsTo(Item, {
    foreignKey: 'itemId',    
    as: 'item'              
  });
  

app.use(express.json());


app.use('/account', accounRoutes);
app.use('/item',authenticateUser ,itemRoutes)
app.use('/cart',authenticateUser ,cartRoutes)
app.use('/order',authenticateUser ,orderRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});