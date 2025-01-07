const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 as verbose

let mainWindow;
let db;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    // Initialize the database
    db = new sqlite3.Database(path.join(app.getPath('userData'), 'expenses.db'), (err) => {
        if (err) {
            console.error('Error opening database: ' + err.message);
        } else {
            db.run(`
                CREATE TABLE IF NOT EXISTS expenses (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  price REAL NOT NULL,
                  date TEXT NOT NULL -- Store as ISO 8601 string (YYYY-MM-DD);
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating table: ' + err.message);
                }
            });
        }
    });

    createWindow();

    // IPC handlers
    ipcMain.handle('add-expense', async (event, name, price, date) => {
        return new Promise((resolve, reject) => {
          const stmt = db.prepare('INSERT INTO expenses (name, price, date) VALUES (?, ?, ?)', (err) => {
            if (err) {
              return reject(err);
            }
          });
      
          stmt.run(name, price, date, function(err) {
            stmt.finalize();
            if (err) {
              return reject(err);
            }
            resolve({ id: this.lastID, name, price, date });
          });
        });
      });

    ipcMain.handle('get-expenses', async () => {
      console.log("expemses");
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM expenses', [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    });

    ipcMain.handle('get-expenses-month-year', async (event, month, year) => {
        return new Promise((resolve, reject) => {
          let query = 'SELECT * FROM expenses';
          const params = [];
      
          if (month && year) {
            query += ' WHERE strftime("%m", date) = ? AND strftime("%Y", date) = ?';
            params.push(month.toString().padStart(2, '0'), year.toString());
          }
      
          db.all(query, params, (err, rows) => {
            if (err) {
              return reject(err);
            }
            resolve(rows);
          });
        });
      });
      

    ipcMain.handle('delete-expense', async (event, id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM expenses WHERE id = ?', id, function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
