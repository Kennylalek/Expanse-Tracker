const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    addExpense: (name, price, date) => ipcRenderer.invoke('add-expense', name, price, date),
    getExpenses: () => ipcRenderer.invoke('get-expenses'),
    deleteExpense: (id) => ipcRenderer.invoke('delete-expense', id),
    getExpensesMY: (month, year) => ipcRenderer.invoke('get-expenses-month-year', month, year)
});
