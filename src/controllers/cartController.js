const Cart = require('../models/cart');
const CartItem = require('../models/cart-item')
const Item = require('../models/item')

exports.addItemtoCart =  async (req, res) => {
    try {
      const { itemId, item_ammount } = req.body;  // Only accept itemId and item_ammount in the request body

      const accountId = req.accountId;  // Get accountId from JWT middleware
  
      // Check if the item exists and get the item_price from the Item table
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found.' });
      }
  
      const item_price = item.item_price;  // Retrieve item price from the Item table
      const total_price = item_price * item_ammount;  // Calculate total price based on item amount
  
      // Check if the account already has an active cart
      let cart = await Cart.findOne({ where: { accountId, cart_status: 'active' } });
  
      // If no active cart exists for this account, create a new one
      if (!cart) {
        cart = await Cart.create({
          cart_status: 'active',
          total_ammount: total_price,  // Initialize total amount with the first item
          accountId  // Associate the cart with the logged-in account
        });
      } else {
        // Update the total_ammount if the cart already exists
        cart.total_ammount += total_price;
        await cart.save();
      }

      const existingCartItem = await CartItem.findOne({ 
        where: { cartId: cart.id, itemId } 
      });

      if (existingCartItem) {
        const itemPrice = await Item.findByPk(itemId);
        if (!itemPrice) {
            return res.status(404).json({ message: 'Item not found.' });
        }
        const newAmount = existingCartItem.item_ammount + item_ammount; // Update the amount
        const newTotalPrice = newAmount * itemPrice.item_price; // Calculate the new total price
        
        existingCartItem.item_ammount = newAmount; // Update the amount in the CartItem
        existingCartItem.total_price = newTotalPrice; // Update the total price
        await existingCartItem.save(); // Save the updated CartItem

        return res.status(200).json({ message: 'Cart item updated successfully!', item: existingCartItem });
    } else {
        // If it does not exist, create a new record in the CartItem table
        const itemPrice = await Item.findByPk(itemId);
        if (!itemPrice) {
            return res.status(404).json({ message: 'Item not found.' });
        }
        const totalPrice = item_ammount * itemPrice.item_price; // Calculate the total price
        
        const newCartItem = await CartItem.create({
            cartId: cart.id,
            itemId,
            item_ammount,
            item_price: itemPrice.item_price,
            total_price: totalPrice,
        });
        // Return the cart and the new cart item
        res.status(201).json({
            message: 'Item added to cart successfully!',
            cart,
            cartItem: newCartItem
        });
    } 
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Failed to add item to cart.' });
    }
}

exports.getUserCart = async (req, res) => {
    try {
        // Step 1: Find the active cart for the logged-in account
        const cart = await Cart.findOne({
            where: { accountId: req.accountId, cart_status: 'active' },
            include: [
                {
                    model: CartItem,
                    as: 'cart-items', // Ensure the alias matches what you defined in the model associations
                    include: [
                        {
                            model: Item, // Assuming you have an Item model defined
                            as: 'item', // This should match the alias in the CartItem model
                            attributes: ['item_name', 'item_description', 'item_price', 'item_type'], // Specify only the attributes you want

                        },
                    ],
                },
            ],
        });

        // Step 2: Check if the cart exists
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this account.' });
        }

        // Step 3: Return the cart and its items
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart.' });
    }
}