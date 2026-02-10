const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
  db.all("SELECT * FROM Payments ORDER BY createdAt DESC", (err, rows) => {
    if (err) throw err;
    console.log('Paiements:');
    console.table(rows);
  });
  db.all("SELECT * FROM Users", (err, rows) => {
    if (err) throw err;
    console.log('Utilisateurs:');
    console.table(rows);
  });
  db.all("SELECT * FROM Services", (err, rows) => {
    if (err) throw err;
    console.log('Services:');
    console.table(rows);
  });
});

db.close();
