// Categories

// show button to add new category
// read from existing data
// if categories exist, list them
// get category amount (all/individual) - loop through all transactions, get total for the category and list
// on add new click, shows text box and save button, shows cancel button, hides add new button
// on cancel click, clears and hides text box and save button, shows add new button and hides itself
// on save click, saves data and does all of cancel click stuff
function init() {
    updateLocalStore();
    categoryList();
    newCategory();

    transactionList();
    newTransaction();

    showPosts();
}

init();

function updateLocalStore() {
    localStorage.setItem('kidsAccountBudgetCategories', JSON.stringify(categories));
    localStorage.setItem('kidsAccountBudgetTransactions', JSON.stringify(transactions));
}

function getLocalStore(type) {
    let store;
    if ("categories" === type) {
        store = JSON.parse(localStorage.getItem('kidsAccountBudgetCategories'));
    } else {
        store = JSON.parse(localStorage.getItem('kidsAccountBudgetTransactions'));
    }
    return store;
}

function categoryList() {
    let categories = getLocalStore("categories");
    let categoriesEl = getEl("categories");
    categoriesEl.innerHTML = "";
    let fragment = document.createDocumentFragment();

    let container = createEl("div");
    container.classList.add("container");

    let rowHeader = createEl("div");
    rowHeader.classList.add("row");

	let colHeader = createEl("div");
    colHeader.classList.add("col", "font-weight-bold");
	colHeader.classList.add("d-none");
    colHeader.innerHTML = "ID";
    rowHeader.appendChild(colHeader);

	colHeader = createEl("div");
    colHeader.classList.add("col", "font-weight-bold");
    colHeader.innerHTML = "Category";
    rowHeader.appendChild(colHeader);

    colHeader = createEl("div");
    colHeader.classList.add("col", "font-weight-bold");
    colHeader.innerHTML = "Total";
    rowHeader.appendChild(colHeader);

    container.appendChild(rowHeader);

    for (let i = 0, max = categories.length; i < max; i++) {
        let row = createEl("div");
        row.classList.add("row");

		let col = createEl("div");
		col.classList.add("col");
		col.classList.add("d-none");
		col.innerHTML = categories[i].categoryid;
		row.appendChild(col);

        col = createEl("div");
        col.classList.add("col");
        col.innerHTML = categories[i].title;
        row.appendChild(col);

        col = createEl("div");
        col.classList.add("col");
        col.innerHTML = getTotals(categories[i].categoryid);
        row.appendChild(col);

        container.appendChild(row);
    }
    fragment.appendChild(container);
    categoriesEl.appendChild(fragment);
}

function getTotals(categoryId) {
    let transactions = getLocalStore("transactions");
    let total = 0;

    for (let i = 0, max = transactions.length; i < max; i++) {
        if (transactions[i].categoryid == categoryId) {
            total = total + transactions[i].amount;
        }
    }

    return total.toFixed(2);
}

function newCategory() {
    var newCategory = getEl("newCategory");
    //newCategory.classList.add( "test" );

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

	var categoryForm = getEl("newCategoryForm");
	categoryForm.addEventListener("submit", saveCategory);
}


function saveCategory(e) {
    e.preventDefault();
    let mainForm = getEl("newCategoryForm");

    let store = [];
    let newElement = {};

    for (let i = 0, max = mainForm.length; i < max; i++) {
        //console.log( "Name: ", mainForm[i].name );
        //console.log( "Value: ", mainForm[i].value );
        newElement["categoryid"] = getCategoryId();
        if (mainForm[i].name) {
            newElement[mainForm[i].name] = mainForm[i].value;
        }
    }

    var stored = JSON.parse(localStorage.getItem("kidsAccountBudgetCategories"));
    stored.push(newElement);
    localStorage.setItem("kidsAccountBudgetCategories", JSON.stringify(stored));

    //clear input
    category.value = "";

    categoryList();
    newTransaction();
}

function getCategoryId() {
    let categories = getLocalStore("categories");
    let id;

    for (let i = 0, max = categories.length; i < max; i++) {
        id = categories[i].categoryid;
    }

    return id + 1;
}

// Transactions

// show button to add a new transaction
// read from existing data
// if transactions exist, list them
// on add new click, show date, category, description and amount; save button, cancel button, hide add new
// on cancel, clears and hides fields and save button; show add new; hide itself
// on save, saves data and does all of cancel click stuff and get category amount

function transactionList() {
    let transactions = getLocalStore("transactions");
    let transactionsEl = getEl("transactions");
    transactionsEl.innerHTML = "";
    let fragment = document.createDocumentFragment();

    let container = createEl("div");
    container.classList.add("container");

    let rowHeader = createEl("div");
    rowHeader.classList.add("row");

	let colHeader = createEl("div");
	colHeader.classList.add("col", "font-weight-bold", "d-none");
    colHeader.innerHTML = "ID";
    rowHeader.appendChild(colHeader);

    colHeader = createEl("div");
	colHeader.classList.add("col", "font-weight-bold");
    colHeader.innerHTML = "Category";
    rowHeader.appendChild(colHeader);

    colHeader = createEl("div");
    colHeader.classList.add("col", "font-weight-bold");
    colHeader.innerHTML = "Description";
    rowHeader.appendChild(colHeader);

    colHeader = createEl("div");
	colHeader.classList.add("col", "font-weight-bold");
    colHeader.innerHTML = "Amount";
    rowHeader.appendChild(colHeader);

    container.appendChild(rowHeader);

    for (let i = 0, max = transactions.length; i < max; i++) {
        let row = createEl("div");
        row.classList.add("row");

		let col = createEl("div");
		col.classList.add("col", "d-none");
		col.innerHTML = transactions[i].transactionid;
		/*if (transactions[i].amount.toFixed(2) < 0) {
			col.classList.add("alert-danger");
		} else {
			col.classList.add("alert-success");
		}*/
		row.appendChild(col);

        col = createEl("div");
        col.classList.add("col");
        col.innerHTML = getCategoryFromId(transactions[i].categoryid);
		/*if (transactions[i].amount.toFixed(2) < 0) {
			col.classList.add("alert-danger");
		} else {
			col.classList.add("alert-success");
		}*/
        row.appendChild(col);

        col = createEl("div");
        col.classList.add("col");
        col.innerHTML = transactions[i].description;
		/*if (transactions[i].amount.toFixed(2) < 0) {
			col.classList.add("alert-danger");
		} else {
			col.classList.add("alert-success");
		}*/
        row.appendChild(col);

        col = createEl("div");
        col.classList.add("col");
        col.innerHTML = transactions[i].amount.toFixed(2);
		/*if (transactions[i].amount.toFixed(2) < 0) {
			col.classList.add("alert-danger");
		} else {
			col.classList.add("alert-success");
		}*/
        row.appendChild(col);

        container.appendChild(row);
    }
    fragment.appendChild(container);
    transactionsEl.appendChild(fragment);
}

function getCategoryFromId(categoryId) {
    let categories = getLocalStore("categories");

    for (let i = 0, max = categories.length; i < max; i++) {
        if (categories[i].categoryid == categoryId) {
            return categories[i].title;
        }
    }
}

function categoryDropdown() {
    let categories = getLocalStore("categories");
    let select = getEl("transactionCategory");
    let fragment = document.createDocumentFragment();

    for (let i = 0, max = categories.length; i < max; i++) {
        let el = createEl("option");
        el.value = categories[i].categoryid;
        el.innerHTML = categories[i].title;
        fragment.appendChild(el);
    }

    select.appendChild(fragment);
}

function newTransaction() {
    var newtransaction = getEl("newTransaction");

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

	var transactionForm = getEl("newTransactionForm");
    transactionForm.addEventListener("submit", saveTransaction);

    categoryDropdown();
}

function saveTransaction(e) {
    e.preventDefault();
	let mainForm = getEl("newTransactionForm");
	let store = [];
    let newElement = {};

    for (let i = 0, max = mainForm.length; i < max; i++) {
        //console.log( "Name: ", mainForm[i].name );
        //console.log( "Value: ", mainForm[i].value );
        newElement["transactionid"] = getTransactionId();
        if (mainForm[i].name == "categoryid") {
            newElement[mainForm[i].name] = parseInt(mainForm[i].value);
        } else if (mainForm[i].name == "amount") {
            newElement[mainForm[i].name] = parseFloat(mainForm[i].value);
        } else if (mainForm[i].name) {
            newElement[mainForm[i].name] = mainForm[i].value;
        }
    }

	var stored = JSON.parse(localStorage.getItem("kidsAccountBudgetTransactions"));
    stored.push(newElement);
    localStorage.setItem("kidsAccountBudgetTransactions", JSON.stringify(stored));
    transactionList();

    //clear input
    transactionDescription.value = "";
    transactionAmount.value = "";

    categoryList();
}

function getTransactionId() {
    let transactions = getLocalStore("transactions");
    let id;

    for (let i = 0, max = transactions.length; i < max; i++) {
        id = transactions[i].transactionid;
    }

    return id + 1;
}

// footer
function showPosts() {
    fetch('https://nationalbankofmom.com/wp-json/wp/v2/posts?per_page=1')
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

    function createSpan(title, link) {

        var span = document.createElement('span');
        var markup = `
		  <a href="` + link + `" target="_blank">` + title + `</a>
		  `;
        span.innerHTML = markup;

        return span;
    }
}

function addToPage(element) {
    var root = document.querySelector('#posts');
    root.appendChild(element);
}
