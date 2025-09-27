const DatabaseLib = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async init() {
    this.db = new DatabaseLib(this.dbPath);

    this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          stock INTEGER
        )`
      )
      .run();

    const count = this.db.prepare("SELECT COUNT(*) as c FROM products").get().c;
    if (count === 0) {
      this.db
        .prepare(
          "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)"
        )
        .run("Sample Item", 9.99, 10);
    }
  }

  async listProducts() {
    return this.db.prepare("SELECT * FROM products").all();
  }

  async createBackup(targetFolder) {
    const backupPath = path.join(targetFolder, "pos-backup.sqlite");
    fs.copyFileSync(this.dbPath, backupPath);
    return backupPath;
  }
}

module.exports = { Database };
