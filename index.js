// Categories

// show button to add new category
// read from existing data
// if categories exist, list them
// get category amount (all/individual) - loop through all transactions, get total for the category and list
// on add new click, shows text box and save button, shows cancel button, hides add new button
// on cancel click, clears and hides text box and save button, shows add new button and hides itself
// on save click, saves data and does all of cancel click stuff

// Transactions

// show button to add a new transaction
// read from existing data
// if transactions exist, list them
// on add new click, show date, category, description and amount; save button, cancel button, hide add new
// on cancel, clears and hides fields and save button; show add new; hide itself
// on save, saves data and does all of cancel click stuff and get category amount

// sample content.json
/*
{
  "categories": [
    {
      "id":1,
      "title":"Clothes"
    },
	{
      "id":2,
      "title":"Entertainment"
    }
  ],
  "transactions": [
    {
      "id":1,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Chores",
      "categoryid":1,
      "amount":20.00
    },
	{
      "id":2,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Allowance",
      "categoryid":2,
      "amount":10.00
    },
	{
	  "id":3,
	  "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
	  "description":"New shirt from Target",
	  "categoryid":1,
	  "amount":-10.50
	},
	{
      "id":4,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Book at HPB",
      "categoryid":2,
      "amount":-8.50
    },
  ]
}
*/
