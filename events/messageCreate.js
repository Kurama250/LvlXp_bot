const { addXP } = require('../utils/xpSystem');
const db = require('../db');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    addXP(db, message.author.id, 10, message.client, message.guild?.id, message);

    db.run('UPDATE xp SET messages = messages + 1 WHERE userId = ?', [message.author.id]);
  }
};
