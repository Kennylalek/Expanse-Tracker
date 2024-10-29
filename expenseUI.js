import manageExpense from "./manageExpense.js";

console.log("first");
class expenseUI {
  constructor() {
    this.expenseManager = new manageExpense();
    this.expenseTable = document
      .getElementById("expenseTable")
      .getElementsByTagName("tbody")[0];
    this.totalLabel = document.getElementById("total");
    this.addExpenseButton = document.getElementById("addExpenseBtn");
    this.expenseInput = document.getElementById("expense");
    this.priceInput = document.getElementById("price");

    this.event();
    this.loadInitialExpenses();

    this.addRowSelectionListener();
    this.addDeleteButtonListner();
  }

  event() {
    this.addExpenseButton.addEventListener("click", () => {
      this.addExpenseUI();
    });
  }

  loadInitialExpenses() {
    [
      { name: "Veg", price: 40.0 },
      { name: "Fruit", price: 70.0 },
      { name: "Fuel", price: 60.0 },
    ].forEach((expense) => this.addExpenseUI(expense.name, expense.price));
  }

  addExpenseUI(name = null, price = null) {
    const expenseName = name || this.expenseInput.value.trim();
    const expensePrice = price || parseFloat(this.priceInput.value.trim());

    if (expenseName && !isNaN(expensePrice)) {
      const newExpenseItem = this.expenseManager.addExpense(
        //add it to the list
        expenseName,
        expensePrice
      );

      this.addExpenseToTable(newExpenseItem);
      this.clearInputFields();
      this.updateTotalUI(); //in ui
    }
  }

  addExpenseToTable(expenseItem) {
    const newRow = document.createElement("tr");
    newRow.dataset.expenseId = this.expenseManager
      .getExpenses()
      .indexOf(expenseItem);

    const expenseCell = document.createElement("td");
    expenseCell.innerText = expenseItem.name;
    newRow.appendChild(expenseCell);

    const priceCell = document.createElement("td");
    priceCell.innerText = expenseItem.price.toFixed(2);
    newRow.appendChild(priceCell);

    this.expenseTable.appendChild(newRow);
  }

  updateTotalUI() {
    this.totalLabel.innerText = this.expenseManager.getTotal().toFixed(2);
  }

  clearInputFields() {
    this.expenseInput.value = "";
    this.priceInput.value = "";
  }
  // delete selected row

    deleteSelectedRow() {
    const selectedRow = document.querySelector('tr.selected');
    if (selectedRow) {
      const expenseId = selectedRow.dataset.expenseId;
      const expenseItem = this.expenseManager.getExpenses()[expenseId];
      this.expenseManager.updateTotal(expenseItem.price, "subtract");
      this.expenseManager.getExpenses().splice(expenseId, 1);
      selectedRow.remove();
      this.updateTotalUI();
    } else {
      alert('Please select the expense to be deleted first.');
    }
  }

// Add click event listener to each row for selection
   addRowSelectionListener(){
    this.expenseTable.addEventListener('click', (event) => {
      const rows = this.expenseTable.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
          rows[i].classList.remove('selected');
      }
      event.target.parentNode.classList.add('selected');
  });
   }
 

// Add delete button event listener
   addDeleteButtonListner(){
    const deleteExpenseBtn = document.getElementById('deletebtn');
    deleteExpenseBtn.addEventListener('click', ()=>this.deleteSelectedRow());
    
   }

}

new expenseUI();
