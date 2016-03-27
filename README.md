# ecom-sample-data

Just clone this, then run the file. 

    node populateOrders.js

It will generate 1500 users, then it will generate 25000 basic transaction records associated to those users. You will end up with a csv file approximately 1 MB in size. You can use this dataset to for any analytics fun.

## About the data

### • You will not actually receive any user data:

Your CSV will have the following rows:

- `id` - The transaction ID
- `user_id` - The ID of the supposed user who conducted the transaction
- `orderQty` - The number of items in the cart *(I should rename this)*
- `subtotal` - The value of the cart
- `date` - The date the order was conducted, as a string
- `timestamp` - The timestamp of the date and time of the order


### • It will very strongly tend to generate orders with a few items, if you give it a large set of orders to generate.

---

# This sucks right now. I know.

This was something I did real quick for some data analytics play. I'm probably going to adjust this to make it more flexible and deliver you better data. No promises, though.
