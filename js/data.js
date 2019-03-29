var categories = [
    {
      "categoryid":1,
      "title":"Clothes"
    },
	{
      "categoryid":2,
      "title":"Entertainment"
    }
  ],
  transactions = [
    {
      "transactionid":1,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Chores",
      "categoryid":1,
      "amount":20.00
    },
	{
      "transactionid":2,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Allowance",
      "categoryid":2,
      "amount":10.00
    },
	{
	  "transactionid":3,
	  "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
	  "description":"New shirt from Target",
	  "categoryid":1,
	  "amount":-10.50
	},
	{
      "transactionid":4,
      "entered":"2019-03-23T11:33:00",
	  "selected":"2019-03-23T11:33:00",
	  "modified":"2019-03-23T11:33:00",
      "description":"Book at HPB",
      "categoryid":2,
      "amount":-8.50
    },
],
data = JSON.stringify( { "categories": categories, "transactions": transactions } );
