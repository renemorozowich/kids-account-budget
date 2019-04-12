/**
 * Initialize.
 *
 */
function init() {
    // get from local storage or if doesn't exist, get data from file
    //if (getData("categories") === null)
	setData("kidsAccountBudgetCategories", JSON.stringify(categories));
    //if (getData("transactions") === null) 
	setData("kidsAccountBudgetTransactions", JSON.stringify(transactions));

    categoryList();
    newCategory();

    transactionList();
    newTransaction();

    showPosts();
}

init();

// Data

/**
 * Sets data.
 *
 * @param {string} storeName The name of the data store.
 * @param {Object} store The data store.
 *
 */
function setData(storeName, store) {
    localStorage.setItem(storeName, store);
}

/**
 * Gets data.
 *
 * @param {string} type The type of data to get (categories or transactions).
 *
 * @return {Object} The data store.
 */
function getData(type) {
    let store;
    if ("categories" === type) {
        store = JSON.parse(localStorage.getItem("kidsAccountBudgetCategories"));
    } else {
        store = JSON.parse(localStorage.getItem("kidsAccountBudgetTransactions"));
    }
    return store;
}

// Categories

/**
 * Shows a list of all categories.
 *
 */
function categoryList() {
    let categories = getData("categories");
    let categoriesEl = getEl("categories");
    // clear any existing categories from the screen
    categoriesEl.innerHTML = "";
    let fragment = document.createDocumentFragment();

    // create a container
    let container = createEl("div");
    container.classList.add("container");

    // create a row for the header
    let rowHeader = createEl("div");
    rowHeader.classList.add("row");

    // create the header columns
    // ID hidden
    let cls = ["col", "font-weight-bold", "d-none"];
    rowHeader.appendChild(createColumn("div", "ID", cls));

    // total, total amount
    cls = ["col", "font-weight-bold"];
    rowHeader.appendChild(createColumn("div", "Total", cls));
    rowHeader.appendChild(createColumn("div", getTotals(0), cls));

    container.appendChild(rowHeader);

    // loop through all categories
    for (var category of categories) {
        // add a row for each
        let row = createEl("div");
        row.classList.add("row");

        // add a column for each field
        // ID hidden
        let colcls = ["col", "d-none"];
        row.appendChild(createColumn("div", category.categoryid, colcls));

        // title, total
        colcls = ["col"];
        row.appendChild(createColumn("div", category.title, colcls));
        row.appendChild(createColumn("div", getTotals(category.categoryid), colcls));

        container.appendChild(row);
    }
    fragment.appendChild(container);
    categoriesEl.appendChild(fragment);
}

/**
 * Gets the total for the specified category (or all categories).
 *
 * @param {int} categoryId The ID of the category or 0 for all.
 *
 * @return {float} The total.
 */
function getTotals(categoryId) {
    let transactions = getData("transactions");
    let total = 0;

    // loop through each transaction and add
    for (var transaction of transactions) {
        if (transaction.categoryid == categoryId) {
            total = total + transaction.amount;
        } else if (0 === categoryId) {
            total = total + transaction.amount;
        }
    }

    // return total with two decimals
    return total.toFixed(2);
}

/**
 * Creates the form to enter a new category.
 *
 */
function newCategory() {
    var newCategory = getEl("newCategory");

    // new category form
    var markup = `
	<form id="newCategoryForm">
	  <div class="form-group">
	    <label for="category">Category</label>
	    <input type="text" class="form-control" id="category" name="title" placeholder="New category">
	  </div>
	  </div>
	  <button type="submit" class="btn btn-primary">Save</button>
	</form>`;

    newCategory.innerHTML = markup;

    // add event listener to submit button to save category on submit
    var categoryForm = getEl("newCategoryForm");
    categoryForm.addEventListener("submit", saveCategory);
}

/**
 * Saves the entered category and refreshes the appropriate areas of the screen.
 *
 */
function saveCategory(e) {
    e.preventDefault();
    let fields = getEl("newCategoryForm");
    let store = []; // array
    let newElement = {}; // object

    // loop through each field on the form
    for (var field of fields) {
        // category id
        newElement["categoryid"] = getCategoryId();
        // name
        if (field.name) {
            newElement[field.name] = field.value;
        } // no others
    }

    // get the stored transactions
    var stored = getData("categories");
    // push the new items
    stored.push(newElement);
    // reset local storage
    setData("kidsAccountBudgetCategories", JSON.stringify(stored));

    // clear input
    category.value = "";

    // refresh category list
    categoryList();
    // refresh new transaction fields (to include new category in dropdown)
    newTransaction();
}

/**
 * Gets the next available category id.
 *
 * @return {int} The next available category id.
 */
function getCategoryId() {
    let categories = getData("categories");
    let id;

    // TODO: rework in case these aren't in order.
    for (var category of categories) {
        id = category.categoryid;
    }

	if (!id) id = 0;
    return id + 1;
}

// Transactions

/**
 * Shows a list of all transactions.
 *
 */
function transactionList() {
    let transactions = getData("transactions");
    let transactionsEl = getEl("transactions");
    // clear any existing transactions from the screen
    transactionsEl.innerHTML = "";
    let fragment = document.createDocumentFragment();

    // create a container
    let container = createEl("div");
    container.classList.add("container");

    // create a row for the header
    let rowHeader = createEl("div");
    rowHeader.classList.add("row");

    // create the header columns
    // ID hidden
    let cls = ["col", "font-weight-bold", "d-none"];
    rowHeader.appendChild(createColumn("div", "ID", cls));

    // category, description, amount
    cls = ["col", "font-weight-bold"];
    rowHeader.appendChild(createColumn("div", "Category", cls));
    rowHeader.appendChild(createColumn("div", "Description", cls));
    rowHeader.appendChild(createColumn("div", "Amount", cls));

    container.appendChild(rowHeader);

    // loop through transactions
    for (var transaction of transactions) {
        // add a row for each
        let row = createEl("div");
        row.classList.add("row");
		row.setAttribute("id", "transaction-" + transaction.transactionid);
		row.addEventListener("dblclick", deleteTransaction);

        // add a column for each field
        // ID hidden
        let colcls = ["col", "d-none"];
        row.appendChild(createColumn("div", transaction.transactionid, colcls));

        // category, description, amount
        colcls = ["col"];
        row.appendChild(createColumn("div", getCategoryFromId(transaction.categoryid), colcls));
        row.appendChild(createColumn("div", transaction.description, colcls));
        row.appendChild(createColumn("div", transaction.amount.toFixed(2), colcls));

        container.appendChild(row);
    }
    fragment.appendChild(container);
    transactionsEl.appendChild(fragment);
}

/**
 * Creates a column.
 *
 * @param {string} element The type of element to create.
 * @param {string} text The innerHTML of the element.
 * @param {array} cls An array of classes to add to the element.
 *
 * @return {string} The title of the category.
 */
function createColumn(element, text, cls) {
    let col = createEl(element);
    col.innerHTML = text;
    for (var cl of cls) {
        col.classList.add(cl);
    }
    return col;
}

/**
 * Gets the category name from the ID
 *
 * @param {int} categoryId The ID of the category.
 *
 * @return {string} The title of the category.
 */
function getCategoryFromId(categoryId) {
    let categories = getData("categories");

    for (var category of categories) {
        if (category.categoryid == categoryId) {
            return category.title;
        }
    }
}

/**
 * Shows all categories in the dropdown
 *
 */
function categoryDropdown() {
    let categories = getData("categories");
    let select = getEl("transactionCategory");
    let fragment = document.createDocumentFragment();

    // loop through each category and create the drop down options with id and value
    for (var category of categories) {
        let el = createEl("option");
        el.value = category.categoryid;
        el.innerHTML = category.title;
        fragment.appendChild(el);
    }

    // append to the select
    select.appendChild(fragment);
}

/**
 * Creates the form to enter a new transaction.
 *
 */
function newTransaction() {
    var newtransaction = getEl("newTransaction");

    // new transaction form
    var transactionMarkup = `
	<form id="newTransactionForm">
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

    // add event listener to submit button to save transaction on submit
    var transactionForm = getEl("newTransactionForm");
    transactionForm.addEventListener("submit", saveTransaction);

    // fill categories dynamically
    categoryDropdown();
}

/**
 * Saves the entered transaction and refreshes the appropriate areas of the screen.
 *
 */
function saveTransaction(e) {
    e.preventDefault();
    let fields = getEl("newTransactionForm");
    let store = []; // array
    let newElement = {}; // object

    // loop through each field on the form
    for (var field of fields) {
        // transaction id
        newElement["transactionid"] = getNextTransactionId();

        // category id (int)
        if (field.name == "categoryid") {
            newElement[field.name] = parseInt(field.value);
            // amount (float)
        } else if (field.name == "amount") {
            newElement[field.name] = parseFloat(field.value);
            // name
        } else if (field.name) {
            newElement[field.name] = field.value;
        }
        // no others (blanks - save button)
    }

    // get the stored transactions
    var stored = getData("transactions");
    // push the new items
    stored.push(newElement);
    // reset local storage
    setData("kidsAccountBudgetTransactions", JSON.stringify(stored));

    // show the transaction list with the updated transaction
    transactionList();

    // clear the fields
    transactionDescription.value = "";
    transactionAmount.value = "";

    // show the category list with updated titles
    categoryList();
}

/**
 * Gets the next available transaction id.
 *
 * @return {int} The next available transaction id.
 */
function getNextTransactionId() {
    let transactions = getData("transactions");
    let id;

    // TODO: rework in case these aren't in order.
    for (var transaction of transactions) {
        id = transaction.transactionid;
    }

	if (!id) id = 0;
    return id + 1;
}

/**
 * Deletes a transaction.
 *
 */
function deleteTransaction(e) {
	let id = e.composedPath()[1].id;
	// get the numeric transaction id for the row
	id = id.split("-")[1];

	// get the stored transactions
    var transactions = getData("transactions");

	for (var i = 0, max = transactions.length; i < max; i++) {
		if (id == transactions[i].transactionid) {
			transactions.splice(i, 1);
			break;
		}
	}

    // reset local storage
    setData("kidsAccountBudgetTransactions", JSON.stringify(transactions));

	// show the transaction list with the updated transaction
    transactionList();

	// show the category list with updated titles
    categoryList();
}


// Posts

/**
 * Gets the most recent post via REST API.
 *
 */
function showPosts() {
    fetch("https://nationalbankofmom.com/wp-json/wp/v2/posts?per_page=1")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw (response);
            }
        })
        .then(function (posts) {
            for (var post of posts) {
                var span = createSpan(post.title.rendered, post.link);
                addToPage(span);
            }
        })
        .catch(function (error) {
            console.log(error)
        });
}

/**
 * Creates a link to the post passed in.
 *
 * @param {string} title The title of the post.
 * @param {string} link The link for the post.
 *
 * @return {string} Markup of the post title with link.
 */
function createSpan(title, link) {
    var span = createEl("span");
    var markup = `
	  <a href="` + link + `" target="_blank">` + title + `</a>
	  `;
    span.innerHTML = markup;

    return span;
}

/**
 * Appends an element to the posts div.
 *
 * @param {Object} element The element to add to page.
 */
function addToPage(element) {
    var posts = getEl("posts");
    posts.appendChild(element);
}

// TODO:
// data validation/tooltips
// add all divs and ids in JS
// condense
// update readme
// upload site online (via git to SiteGround?)
