import ManageExpense from "./manageExpense.js";

class ExpenseUI {
  constructor() {
    this.expenseManager = new ManageExpense();
    this.expenseTable = document
      .getElementById("expenseTable")
      .getElementsByTagName("tbody")[0];
    this.totalLabel = document.getElementById("total");
    this.addExpenseButton = document.getElementById("addExpenseBtn");
    this.expenseInput = document.getElementById("expense");
    this.priceInput = document.getElementById("price");
    this.dateInput = document.getElementById("expenseDate");

    this.dateInput.value = new Date().toISOString().split('T')[0];


    this.event();
    this.loadExpenses();
    this.addRowSelectionListener();
    this.addDeleteButtonListener();
  }

  event() {
    this.addExpenseButton.addEventListener("click", () => {
      this.addExpenseUI();
    });
  }

  async loadExpenses() {
    const expenses = await this.expenseManager.getExpenses();
    expenses.forEach(expense => this.addExpenseToTable(expense));
    this.updateTotalUI();
  }

  async addExpenseUI() {
    const expenseName = this.expenseInput.value.trim();
    const expensePrice = parseFloat(this.priceInput.value.trim());
    const date = Date(this.dateInput.value);

    if (expenseName && !isNaN(expensePrice)) {
      const newExpense = await this.expenseManager.addExpense(expenseName, expensePrice, date);
      this.addExpenseToTable(newExpense);
      this.clearInputFields();
      this.updateTotalUI();
    }
  }

  addExpenseToTable(expense) {
    const newRow = document.createElement("tr");
    newRow.dataset.expenseId = expense.id;

    const expenseCell = document.createElement("td");
    expenseCell.innerText = expense.name;
    newRow.appendChild(expenseCell);

    const priceCell = document.createElement("td");
    priceCell.innerText = expense.price.toFixed(2);
    newRow.appendChild(priceCell);

    const dateCell = document.createElement("td");
    dateCell.innerText = expense.date;
    newRow.appendChild(dateCell);

    const deleteBtnCell = document.createElement("td");
    deleteBtnCell.classList.add("deleteCell");
    const button = document.createElement("button");
    button.classList.add("deleteBtn");
    button.innerHTML = "Delete";
    button.addEventListener("click", () => this.deleteSelectedRow(button));
    deleteBtnCell.appendChild(button);
    newRow.appendChild(deleteBtnCell);

    this.expenseTable.appendChild(newRow);
  }

  updateTotalUI() {
    this.totalLabel.innerText = this.expenseManager.getTotal().toFixed(2);
  }

  clearInputFields() {
    this.expenseInput.value = "";
    this.priceInput.value = "";
  }

  async deleteSelectedRow(button) {
    const selectedRow = button.parentNode.parentNode;
    if (selectedRow) {
      const expenseId = selectedRow.dataset.expenseId;
      await this.expenseManager.deleteExpense(parseInt(expenseId));
      selectedRow.remove();
      this.updateTotalUI();
    } else {
      alert("Please select the expense to be deleted first.");
    }
  }

  addRowSelectionListener() {
    this.expenseTable.addEventListener("click", (event) => {
      const rows = this.expenseTable.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("selected");
      }
      event.target.parentNode.classList.add("selected");
    });
  }

  addDeleteButtonListener() {
    const deleteExpenseBtn = document.getElementById("deletebtn");
    deleteExpenseBtn.addEventListener("click", () => this.deleteSelectedRow());
  }
}

new ExpenseUI();
