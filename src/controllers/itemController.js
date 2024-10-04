const Item = require('../models/item');
const { Op } = require('sequelize'); // Import Sequelize operators

exports.createItem = async (req, res) => {
    try {
      const newItem = await Item.create({...req.body, views: 0});
  
      res.status(200).json({ message: 'Item added succesfuly!', item: newItem });
  
    } catch (error) {
      res.status(500).json({ message: 'Failed to add item.' });
    }
}

exports.getItemByID = async (req, res) => {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) {
        res.status(404).json({ message: 'Item not found.' });
      } else {  
          // Increment the views field by 1
          item.views += 1;
          await item.save();
          res.status(200).json(item);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch item by id.' });
    }
}

exports.getAllItem = async (req, res) => {
    try {
      const { item_type, min_price, max_price, sort_by_price , sort_by_view, search_by_name} = req.query;

      // Define a query object to dynamically add conditions
      const queryOptions = {
      where: {},
      attributes: ['id','item_name', 'item_price', 'item_stock'],  // Only include specific fields

      };

      // Filter by item_type if provided
      if (item_type) {
      queryOptions.where.item_type = item_type;
      }

      // Filter by price range if provided
      if (min_price && max_price) {
      queryOptions.where.item_price = {
          [Op.between]: [parseFloat(min_price), parseFloat(max_price)]  // Ensure prices are numbers
      };
      } else if (min_price) {
      queryOptions.where.item_price = {
          [Op.gte]: parseFloat(min_price)  // Ensure price is a number
      };
      } else if (max_price) {
      queryOptions.where.item_price = {
          [Op.lte]: parseFloat(max_price)  // Ensure price is a number
      };
      }
      //search by name
      if (search_by_name) {
        queryOptions.where.item_name = {
            [Op.like]: `%${search_by_name}%` // Use wildcard for partial matches
        };
    }
      // Sort by item_price if provided
      if (sort_by_price) {
      queryOptions.order = [['item_price', sort_by_price]]; // 'ASC' or 'DESC'
      }

      // Sort by views if provided
      if (sort_by_view) {
      queryOptions.order = [['views', sort_by_view]]; // 'ASC' or 'DESC'
      }
  

      const items = await Item.findAll(queryOptions);
      res.json(items);
    } catch (error){
      res.status(500).json({message: 'Failed to fetch items'});
    }
}
