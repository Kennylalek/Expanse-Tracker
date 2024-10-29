import expense from "./expense.js";

class manageExpense {
  constructor() {
    this.expenses = [];
    this.total = 0;
  }

  addExpense(Name, Price) {
    const newExpense = new expense(Name, Price);
    this.expenses.push(newExpense);
    this.updateTotal(Price, "add"); //add this expense to the total

    return newExpense;
  }

  updateTotal(amount, operation) {
    if (operation == "add") {
      this.total += amount;
    } else if (operation == "subtract") {
      this.total -= amount;
    }
  }

  getExpenses() {
    return this.expenses;
  }

  getTotal() {
    return this.total;
  }
}

export default manageExpense;
