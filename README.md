- [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/hosefg/simple-ecommerce-nodejs.git
    ```

2. Navigate to the project directory:

    ```bash
    cd simple-ecommerce-nodejs
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root of the project and set up environment variables (if necessary):

    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    ```

5. Start the server:

    ```bash
    node src/index.js
    ```

## API Endpoints

1. POST /account
     ```
     This endpoint is used to register and account (registered account must have unique email adress)
     ```
     
2. POST /account/login
     ```
     This endpoint is used to log in registered account 
     ```
3. POST /item
     ```
     This endpoint is used to store new item in the database.
    
     ```
4. GET  /item
     ```
     This endpoint is used to get all items in the database
     There are several params available for this endpoint, which are:
     - item_type = to filter all the items based on the item_type
     - min_price and max_price = to filter the items based on selected price range
     - sort_by_price = to sort all the items by price ('ASC','DESC')
     - sort_by_view = to sort all the items by views ('ASC', 'DESC')
     - search_by_name = to search the item by its name
     ```
5. GET  /item/:id
     ```
     This endpoint is used to get item spesifically at the database by id
     ```
6. POST /cart/item
     ```
     This endpoint is used to store selected item(by id) to 'active' logged in account's cart(if its not exist, create one). 
     If the same item already exist in the active cart, it will update the item ammount instead of adding a new record in the db
     ```
7. GET  /cart
     ```
     This endpoint is used to get loggen in account cart detail
     ```
8. POST /order/create-order
     ```
     This endpoint is used to create new order based on what items in account's cart
     ```
9. GET  /order-history
     ```
     This endpoint get logged in account all order history
     ```
10. GET /order/:orderNumber
    ```
     This endpoint get order by its order number
     ```
