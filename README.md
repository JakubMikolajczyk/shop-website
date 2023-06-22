# shop-website

## Technology:
* node.js
* express.js
* mssql
* ejs

## Features:
* Everyone:
    * login/register
    * product searching

* User:
   * can add product to cart
   * can create order
   * can see own order history

* Admin:
  * can create/edit/delete product
  * can see order history
  * can see all users


## How to run
  1. Clone this repo
  2. Create database (schemas are on branch sandbox app/skrypty_do_bazy run them in order)
  3. In app/app.js change mssql.connect for your connect to database
  4. Run (app is listen on port 3000)
