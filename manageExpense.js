class ManageExpense {
  constructor() {
    this.total = 0;
  }

  async addExpense(name, price, date) {
    try {
      if (typeof name !== "string" || name.trim() === "") {
        throw new Error("Expense name must be a valid non-empty string.");
      }

      if (typeof price !== "number" || price <= 0) {
        throw new Error("Price must be a positive number.");
      }

      const MAX_PRICE = 10000;
      if (price > MAX_PRICE) {
        throw new Error(`Price cannot exceed ${MAX_PRICE}.`);
      }

      const newExpense = await window.electron.addExpense(name, price, date);
      this.updateTotal(price, "add");

      return newExpense;
    } catch (error) {
      alert(error.message);
      throw error; // Rethrow for handling in UI
    }
  }

  async getExpenses() {
    const expenses = await window.electron.getExpenses();
    let t = 0;

    for (let i = 0; i < expenses.length; i++) {
      t += expenses[i].price;
    }
    this.total = t;
    return expenses;
  }

  async deleteExpense(id) {
    const expenses = await this.getExpenses();
    const expenseToDelete = expenses.find(exp => exp.id === id);

    if (expenseToDelete) {
      await window.electron.deleteExpense(id);
      this.updateTotal(expenseToDelete.price, "subtract");
    }
  }

  updateTotal(amount = 0, operation) {
    if (operation === "add") {
      this.total += amount;
    } else if (operation === "subtract") {
      this.total -= amount;
    }
  }

  getTotal() {
    return this.total;
  }
}

export default ManageExpense;
