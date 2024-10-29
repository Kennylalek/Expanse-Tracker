import Expense from "./expense.js";



class manageExpense {
  constructor() {
    this.expenses = [];
    this.total = 0;
  }

  addExpense(Name, Price) {     
    try {
        
        if (typeof Name !== "string" || Name.trim() === "") {
            throw new Error("Expense name must be a valid non-empty string.");
        }

        
        if (typeof Price !== "number") {
            throw new Error("Price must be a number.");
        }

        
        if (Price < 0) {
            throw new Error("Price cannot be negative.");
        }
        if (Price === 0) {
            throw new Error("Price cannot be zero.");
        }

       
        const MAX_PRICE = 10000;
        if (Price > MAX_PRICE) {
            throw new Error(`Price cannot exceed ${MAX_PRICE}.`);
        }

        
        const newExpense = new Expense(Name, Price);
        this.expenses.push(newExpense);
        this.updateTotal(Price, "add");

       
        document.getElementById("expense").value = "";
        document.getElementById("price").value = "";
        
        return newExpense;

    } catch (error) {
        alert(error.message); 
        
        
        document.getElementById("price").focus();
        document.getElementById("price").value = "";
    }
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
