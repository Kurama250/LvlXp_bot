const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./xp.sqlite');
db.run("CREATE TABLE IF NOT EXISTS xp (userId TEXT PRIMARY KEY, xp INTEGER, level INTEGER)");
module.exports = db;