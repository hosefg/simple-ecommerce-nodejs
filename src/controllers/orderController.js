const Cart = require('../models/cart');
const CartItem = require('../models/cart-item')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')
const Item = require('../models/item')
const express = require('express');
const Account = require('../models/account');

exports.createOrderFromCart = async (req, res) => {
    try {
        // Get the cart associated with the logged-in user
        const cart = await Cart.findOne({
            where: {
                accountId: req.accountId, // Assuming req.accountId is set by your auth middleware
                cart_status: 'active', // Adjust based on your business logic
            },
            include: [{
                model: CartItem,
                as: 'cart-items', // Adjust based on your association alias
                include: [{
                    model: Item, // Assuming you have an Item model
                    as: 'item' // Adjust based on your association alias
                }]
            }]
        });

        if (!cart) {
            return res.status(404).json({ message: 'Active cart not found for this user.' });
        }

          // Fetch the account details
        const account = await Account.findByPk(req.accountId);
        if (!account) {
        return res.status(404).json({ message: 'Account not found.' });
        }

        const generateOrderNumber = () => {
            const timestamp = Date.now(); // Current timestamp
            const randomPart = Math.floor(Math.random() * 10000); // Random number
            return `ORD-${timestamp}-${randomPart}`; // Example format: ORD-1627698471875-1234
        };

        let totalAmount = cart.total_ammount;
        let discountAmount = cart.total_ammount
        if (account.flagNewAccount) {
          totalAmount *= 0.7;  // Apply 30% discount
          discountAmount *= 0.3
        }

        // Create an order
        const newOrder = await Order.create({
            accountId: req.accountId, // Ensure you have the accountId from authentication middleware
            total_price: totalAmount, // Assume total amount is stored in the cart
            discount_price: discountAmount,
            order_status: "Placed",
            order_number: generateOrderNumber()
        });

        // Create order items based on cart items
        const orderItemsPromises = cart['cart-items'].map(cartItem => {
            return OrderItem.create({
                orderId: newOrder.id, // Associate with the new order
                itemId: cartItem.itemId, // Assuming itemId is available
                item_ammount: cartItem.item_ammount,
                item_price: cartItem.item_price,
                total_price: cartItem.total_price,
            });
        });

        // Wait for all order items to be created
        await Promise.all(orderItemsPromises);

        // Update cart status to 'completed'
        await cart.update({ cart_status: 'completed' });
        // Set flagNewAccount to false after the first purchase
        if (account.flagNewAccount) {
            account.flagNewAccount = false;
            await account.save();  // Update the account to reflect that the discount has been used
        }

        return res.status(201).json({ message: 'Order created successfully!', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Failed to create order.' });
    }
}

exports.getAllUserOrder = async (req, res) => {
    try {
        const accountId = req.accountId; // Extract accountId from authenticated request
        
        // Find all orders for the logged-in account
        const orders = await Order.findAll({
            where: { accountId },
            include: [
                {
                    model: OrderItem,
                    as: 'order-items', 
                    include: [
                        {
                            model: Item, 
                            as: 'item', // Alias for the item model
                            attributes: ['item_name', 'item_description', 'item_price', 'item_type'], // Select specific fields from Item
                        }
                    ]
                }
            ]
        });

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this account.' });
        }

        // Return the orders
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
};

exports.getOrderByOrderNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params; // Extract order number from the request params

        // Find the order by its orderNumber
        const order = await Order.findOne({
            where: { order_number: orderNumber }, // Assume your order model has 'order_number' column
            include: [
                {
                    model: OrderItem,
                    as: 'order-items', // Ensure the alias matches your model association
                    include: [
                        {
                            model: Item, // Assuming the OrderItem is associated with the Item model
                            as: 'item', // Alias for the item model
                            attributes: ['item_name', 'item_description', 'item_price', 'item_type'], // Select specific fields from Item
                        }
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Return the order
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order.' });
    }
};