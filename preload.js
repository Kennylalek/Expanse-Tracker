const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    addExpense: (name, price) => ipcRenderer.invoke('add-expense', name, price),
    getExpenses: () => ipcRenderer.invoke('get-expenses'),
    deleteExpense: (id) => ipcRenderer.invoke('delete-expense', id),
});
