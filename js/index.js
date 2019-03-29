// Categories

// show button to add new category
// read from existing data
// if categories exist, list them
// get category amount (all/individual) - loop through all transactions, get total for the category and list
// on add new click, shows text box and save button, shows cancel button, hides add new button
// on cancel click, clears and hides text box and save button, shows add new button and hides itself
// on save click, saves data and does all of cancel click stuff


function updateLocalStore( store ) {
  localStorage.setItem( 'kidsAccountBudget', store );
}

updateLocalStore( data );

function getLocalStore() {
  let store = JSON.parse( localStorage.getItem( 'kidsAccountBudget' ) );
  return store;
}

function categoryList() {
  let categories = getLocalStore().categories;
  let categoriesEl = getEl( "categories" );
  let fragment = document.createDocumentFragment();

  let container = createEl( "div" );
  container.classList.add( "container" );

  let rowHeader = createEl( "div" );
  rowHeader.classList.add( "row" );

  let colHeader = createEl( "div" );
  colHeader.classList.add( "col" );
  colHeader.classList.add( "col-header" );
  colHeader.innerHTML = "Category";
  rowHeader.appendChild( colHeader );

  colHeader = createEl( "div" );
  colHeader.classList.add( "col" );
  colHeader.classList.add( "col-header" );
  colHeader.innerHTML = "Total";
  rowHeader.appendChild( colHeader );

  container.appendChild( rowHeader );

  for (let i = 0, max = categories.length; i < max; i++) {
	  let row = createEl( "div" );
	  row.classList.add( "row" );

	  let col = createEl( "div" );
	  col.classList.add( "col" );
	  col.innerHTML = categories[i].title;
      row.appendChild( col );

	  col = createEl( "div" );
	  col.classList.add( "col" );
	  col.innerHTML = getTotals( categories[i].categoryid );
	  row.appendChild( col );

	  container.appendChild( row );
  }
  fragment.appendChild( container );
  categoriesEl.appendChild( fragment );
}

categoryList();

function getTotals( categoryId ) {
	let transactions = getLocalStore().transactions;
	let total = 0;

	for (let i = 0, max = transactions.length; i < max; i++) {
		if ( transactions[i].categoryid == categoryId ) {
			total = total + transactions[i].amount;
		}
	}

	return total.toFixed(2);
}

var newCategory = getEl( "newCategory" );
//newCategory.classList.add( "test" );

var markup = `
<form>
  <div class="form-group">
    <label for="category">Category</label>
    <input type="text" class="form-control" id="category" placeholder="New category">
	<small id="categoryHelp" class="form-text text-muted">Enter a category you would like to budget for</small>
  </div>
  </div>
  <button type="submit" class="btn btn-primary">Save</button>
</form>`;

newCategory.innerHTML = markup;



// Transactions

// show button to add a new transaction
// read from existing data
// if transactions exist, list them
// on add new click, show date, category, description and amount; save button, cancel button, hide add new
// on cancel, clears and hides fields and save button; show add new; hide itself
// on save, saves data and does all of cancel click stuff and get category amount

function transactionList() {
  let transactions = getLocalStore().transactions;
  let transactionsEl = getEl( "transactions" );
  let fragment = document.createDocumentFragment();

  let container = createEl( "div" );
  container.classList.add( "container" );

  let rowHeader = createEl( "div" );
  rowHeader.classList.add( "row" );

  let colHeader = createEl( "div" );
  colHeader.classList.add( "col" );
  colHeader.classList.add( "col-header" );
  colHeader.innerHTML = "Category";
  rowHeader.appendChild( colHeader );

  colHeader = createEl( "div" );
  colHeader.classList.add( "col" );
  colHeader.classList.add( "col-header" );
  colHeader.innerHTML = "Description";
  rowHeader.appendChild( colHeader );

  colHeader = createEl( "div" );
  colHeader.classList.add( "col" );
  colHeader.classList.add( "col-header" );
  colHeader.innerHTML = "Amount";
  rowHeader.appendChild( colHeader );

  container.appendChild( rowHeader );

  for (let i = 0, max = transactions.length; i < max; i++) {
	  let row = createEl( "div" );
	  row.classList.add( "row" );

	  let col = createEl( "div" );
	  col.classList.add( "col" );
	  col.innerHTML = getCategoryFromId( transactions[i].categoryid );
	  row.appendChild( col );

	  col = createEl( "div" );
	  col.classList.add( "col" );
	  col.innerHTML = transactions[i].description;
	  row.appendChild( col );

	  col = createEl( "div" );
	  col.classList.add( "col" );
	  col.innerHTML = transactions[i].amount.toFixed(2);
	  row.appendChild( col );

	  container.appendChild( row );
  }
  fragment.appendChild( container );
  transactionsEl.appendChild( fragment );
}

transactionList();

function getCategoryFromId( categoryId ) {
  let categories = getLocalStore().categories;

  for (let i = 0, max = categories.length; i < max; i++) {
	if ( categories[i].categoryid == categoryId ) {
	  return categories[i].title;
	}
  }
}

function categoryDropdown() {
  let categories = getLocalStore().categories;
  let select = getEl( "transactionCategory" );
  let fragment = document.createDocumentFragment();

  for (let i = 0, max = categories.length; i < max; i++) {
	  let el = createEl( "option" );
      el.value = categories[i].id;
	  el.innerHTML = categories[i].title;
      fragment.appendChild(el);
  }

  select.appendChild( fragment );
}

var newtransaction = getEl( "newTransaction" );

var transactionMarkup = `
<form id="newTransaction">
  <div class="form-row">
    <div class="form-group col-md-4">
      <label for="transactionCategory">Category</label>
      <select id="transactionCategory" name="categoryid" class="form-control">
      </select>
    </div>
	<div class="form-group col-md-4">
	  <label for="transactionDescription">Description</label>
	  <input type="text" name="description" class="form-control" id="transactionDescription" placeholder="Description">
	</div>
	<div class="form-group col-md-4">
      <label for="transactionAmount">Amount</label>
      <input type="text" name="amount" class="form-control" id="transactionAmount" placeholder="Amount">
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Save</button>
</form>`;

newtransaction.innerHTML = transactionMarkup;

//content.appendChild( categoriesDiv );

categoryDropdown();

var form = getEl("newTransaction");
form.addEventListener("submit", saveTransaction);

function saveTransaction( e ) {
	e.preventDefault();
	let mainForm = getEl( "newTransaction" );

	let store = [];
	let newElement = {};

	for( let i = 0, max = mainForm.length; i < max; i++ ) {
		//console.log( "Name: ", mainForm[i].name );
		//console.log( "Value: ", mainForm[i].value );

    	newElement[mainForm[i].name] = mainForm[i].value;
	}

	store.push( newElement );
	//console.log( store );

    // TODO: need to add to, not completely remove!!
	updateLocalStore( JSON.stringify( store ) );
}
